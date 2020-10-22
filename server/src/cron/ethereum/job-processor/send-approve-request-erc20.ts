import { isNil } from 'lodash'
import BigNumber from 'bignumber.js'
import {
  IJobProcessor,
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
  EBlockchainNetwork,
  IBlockchainJob,
  Transaction,
  Wallet,
  EBlockchainTransactionStatus,
  TimeHelper,
  IBlockchainNetwork,
} from '../../../global'

export class JobFinisher implements IJobFinisher {
  constructor(public blockchainNetwork: IBlockchainNetwork) {}

  async finish(job: IBlockchainJob) {
    if (job.status === EBlockchainJobStatus.PROCESSING) this.finishSuccessJob(job)
    if (job.status === EBlockchainJobStatus.SKIPPED) this.finishSkippedJob(job)
    const newJob = await BlockchainJob.create({
      transactionId: job.transactionId,
      network: EBlockchainNetwork.ETHEREUM,
      status: EBlockchainJobStatus.JUST_CREATED,
      type: EBlockchainJobType.SEND_TRANSFER_FROM_REQUEST_ERC20,
    })
    console.log(`[CREATE NEW JOB]: ${JSON.stringify(newJob)}`)
  }

  async finishSuccessJob(job: IBlockchainJob) {
    const { blockNumber } = await this.blockchainNetwork.getTransactionReceipt(job.hash)
    await BlockchainJob.findByIdAndUpdate(
      job.blockchainJobId,
      { status: EBlockchainJobStatus.SUCCESS, block: blockNumber }
    )
  }

  async finishSkippedJob(job: IBlockchainJob) {
    await BlockchainJob.findByIdAndUpdate(
      job.blockchainJobId,
      { status: EBlockchainJobStatus.CANCELED }
    )
  }
}

export class JobChecker implements IJobChecker {
  static RETRY_AFTER = 3 * 60 * 1000 // 3 minutes

  constructor(public blockchainNetwork: IBlockchainNetwork) {}

  async check(job: IBlockchainJob) {
    if (job.status === EBlockchainJobStatus.JUST_CREATED) {
      const isWalletAvailable = await this.isWalletAvailable(job)
      console.log(`[WALLET AVAILABILITY] wallet ${job.walletId} is available? ${isWalletAvailable}`)
      if (isWalletAvailable) return EJobAction.EXCUTE
      return EJobAction.WAIT
    }
    if (job.status === EBlockchainJobStatus.SKIPPED) {
      return EJobAction.FINISH
    }
    const status = await this.blockchainNetwork.getTransactionStatus(job.hash)
    console.log(`[ETHEREUM STATUS] Job ${job.blockchainJobId} hash ${job.hash} status ${status}`)
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
    // TODO: make it better
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
    const isApproved = await this
      .blockchainNetwork
      .getTokenContract(transaction.assetAddress)
      .isApproved(transaction.walletAddress)
    if (isApproved) {
      await BlockchainJob.findByIdAndUpdate(
        job.blockchainJobId,
        {
          status: EBlockchainJobStatus.SKIPPED,
          excutedAt: new Date(TimeHelper.now()),
        }
      )
      return
    }
    const { index } = await Wallet.findById(transaction.walletId)
    const { privateKey, publicKey } = await this.blockchainNetwork.getKeysByIndex(index)
    const gasPrice = await this.getGasPrice(job)
    const hash = await this.blockchainNetwork
      .getTokenContract(transaction.assetAddress, privateKey)
      .approve(publicKey, gasPrice)
    await BlockchainJob.findByIdAndUpdate(
      job.blockchainJobId,
      {
        status: EBlockchainJobStatus.PROCESSING,
        excutedAt: new Date(TimeHelper.now()),
        hash,
      }
    )
  }

  private async getGasPrice(job: IBlockchainJob) {
    const transaction = await Transaction.findById(job.transactionId)
    const gasLimitForApproveRequest = await this
      .blockchainNetwork
      .getTokenContract(transaction.assetAddress)
      .getGasLimitForApproving(transaction.walletAddress)
    const { hash } = await BlockchainJob.findOne({
      transactionId: job.transactionId,
      type: EBlockchainJobType.TRANSFER_ETHEREUM_TO_SEND_APPROVE_REQUEST_ERC20,
    })
    const { value } = await this.blockchainNetwork.getTransaction(hash)
    return new BigNumber(value)
      .dividedBy(gasLimitForApproveRequest)
      .integerValue(BigNumber.ROUND_DOWN)
      .toNumber()
  }
}

export class JobProcessor implements IJobProcessor {
  constructor(public blockchainNetwork: IBlockchainNetwork) {}

  finisher = new JobFinisher(this.blockchainNetwork)
  checker = new JobChecker(this.blockchainNetwork)
  retrier = new JobRetrier()
  excutor = new JobExcutor(this.blockchainNetwork)
}
