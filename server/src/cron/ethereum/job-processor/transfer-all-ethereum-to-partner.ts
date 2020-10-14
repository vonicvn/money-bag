import { isNil } from 'lodash'
import BigNumber from 'bignumber.js'
import {
  IJobProcessor,
  IJobCreator,
  IBlockchainJobInput,
  IJobChecker,
  IJobFinisher,
  IJobRetrier,
  IJobExcutor,
  EJobAction,
} from './metadata'
import {
  BlockchainJob,
  EBlockchainJobType,
  EBlockchainJobStatus,
  IBlockchainJob,
  Transaction,
  Wallet,
  Partner,
  EBlockchainTransactionStatus,
  TimeHelper,
  ECollectingStatus,
  IBlockchainNetwork,
} from '../../../global'

export class JobCreator implements IJobCreator {
  constructor(public blockchainNetwork: IBlockchainNetwork) {}

  async create({ transaction }: IBlockchainJobInput) {
    const job = await BlockchainJob.create({
      transactionId: transaction.transactionId,
      network: this.blockchainNetwork.network,
      status: EBlockchainJobStatus.JUST_CREATED,
      type: EBlockchainJobType.TRANSFER_ALL_ETHEREUM,
      walletId: transaction.walletId,
    })
    console.log(`[CREATE NEW JOB]: ${JSON.stringify(job)}`)
  }
}

export class JobFinisher implements IJobFinisher {
  constructor(public blockchainNetwork: IBlockchainNetwork) {}

  async finish(job: IBlockchainJob) {
    const { blockNumber } = await this.blockchainNetwork.getTransactionReceipt(job.hash)
    await BlockchainJob.findByIdAndUpdate(
      job.blockchainJobId,
      { status: EBlockchainJobStatus.SUCCESS, block: blockNumber }
    )
    await Transaction.findByIdAndUpdate(
      job.transactionId,
      {
        collectingStatus: ECollectingStatus.SUCCESS,
        collectingBlock: blockNumber,
        collectingHash: job.hash,
      }
    )
  }
}

export class JobChecker implements IJobChecker {
  constructor(public blockchainNetwork: IBlockchainNetwork) {}

  static RETRY_AFTER = 3 * 60 * 1000 // 3 minutes
  async check(job: IBlockchainJob) {
    if (job.status === EBlockchainJobStatus.JUST_CREATED) {
      const isWalletAvailable = await this.isWalletAvailable(job)
      console.log(`[WALLET AVAILABILITY] wallet ${job.walletId} is available? ${isWalletAvailable}`)
      if (isWalletAvailable) return EJobAction.EXCUTE
      return EJobAction.WAIT
    }
    const status = await this.blockchainNetwork.getTransactionStatus(job.hash)
    console.log(`[BLOCKCHAIN STATUS] Job ${job.blockchainJobId} hash ${job.hash} status ${status}`)
    if (status === EBlockchainTransactionStatus.SUCCESS) return EJobAction.FINISH
    if (status === EBlockchainTransactionStatus.WAIT_FOR_MORE_COMFIRMATIONS) return EJobAction.WAIT
    if (status === EBlockchainTransactionStatus.PENDING) {
      const shouldWaitMore = TimeHelper.smallerThan(
        TimeHelper.now(),
        TimeHelper.after(JobChecker.RETRY_AFTER)
      )
      if (shouldWaitMore) return EJobAction.WAIT
      return EJobAction.RETRY
    }
    if (status === EBlockchainTransactionStatus.FAILED) return EJobAction.RETRY
  }

  private async isWalletAvailable(job: IBlockchainJob) {
    const transaction = await Transaction.findById(job.transactionId)
    const blockingJob = await BlockchainJob.findOne({
      walletId: transaction.walletId,
      status: EBlockchainJobStatus.PROCESSING,
    })
    return isNil(blockingJob)
  }
}

export class JobRetrier implements IJobRetrier {
  async retry(job: IBlockchainJob) {
    await BlockchainJob.findByIdAndUpdate(job.blockchainJobId, {
      status: EBlockchainJobStatus.JUST_CREATED,
    })
  }
}

export class JobExcutor implements IJobExcutor {
  constructor(public blockchainNetwork: IBlockchainNetwork) {}

  async excute(job: IBlockchainJob) {
    console.log('[START EXCUTE]', job)
    const transaction = await Transaction.findOne({ transactionId: job.transactionId })
    const { index, partnerId } = await Wallet.findById(transaction.walletId)
    const { privateKey, publicKey } = await this.blockchainNetwork.getKeysByIndex(index)
    const gasPrice = await this.blockchainNetwork.getGasPrice()
    const GAS_LIMIT = 21000
    const nonce = await this.blockchainNetwork.getTransactionCount(publicKey)
    const { ethereumWallet } = await Partner.findById(partnerId)
    const value = new BigNumber(transaction.value)
      .multipliedBy(Math.pow(10, 18))
      .minus(
        new BigNumber(GAS_LIMIT).multipliedBy(gasPrice)
      )
      .toString()

    const hash = await this.blockchainNetwork.sendTransaction({
      fromPrivateKey: privateKey,
      fromAddress: publicKey,
      value,
      nonce,
      gasPrice,
      toAddress: ethereumWallet,
    })
    await BlockchainJob.findByIdAndUpdate(
      job.blockchainJobId,
      {
        status: EBlockchainJobStatus.PROCESSING,
        excutedAt: new Date(TimeHelper.now()),
        hash,
      }
    )
  }
}

export class JobProcessor implements IJobProcessor {
  constructor(public blockchainNetwork: IBlockchainNetwork) {}

  creator = new JobCreator(this.blockchainNetwork)
  finisher = new JobFinisher(this.blockchainNetwork)
  checker = new JobChecker(this.blockchainNetwork)
  retrier = new JobRetrier()
  excutor = new JobExcutor(this.blockchainNetwork)
}
