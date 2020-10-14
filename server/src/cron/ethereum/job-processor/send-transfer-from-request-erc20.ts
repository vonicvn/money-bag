import { isNil, map } from 'lodash'
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
  EBlockchainNetwork,
  IBlockchainJob,
  Transaction,
  Partner,
  TimeHelper,
  ECollectingStatus,
  AdminAccount,
  Asset,
  IBlockchainNetwork,
  EBlockchainTransactionStatus,
} from '../../../global'

export class JobCreator implements IJobCreator {
  constructor(public blockchainNetwork: IBlockchainNetwork) {}

  async create({ transaction }: IBlockchainJobInput) {
    const job = await BlockchainJob.create({
      transactionId: transaction.transactionId,
      network: EBlockchainNetwork.ETHEREUM,
      status: EBlockchainJobStatus.JUST_CREATED,
      type: EBlockchainJobType.SEND_TRANSFER_FROM_REQUEST_ERC20,
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
  static RETRY_AFTER = 3 * 60 * 1000 // 3 minutes

  constructor(public blockchainNetwork: IBlockchainNetwork) {}

  async check(job: IBlockchainJob) {
    if (job.status === EBlockchainJobStatus.JUST_CREATED) {
      return EJobAction.EXCUTE
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
    const transaction = await Transaction.findOne({ transactionId: job.transactionId })
    const adminAccount = await this.getAdminAccount(transaction.partnerId)
    if (isNil(adminAccount)) {
      return
    }
    console.log('[START EXCUTE]', job)
    const gasPrice = await this.blockchainNetwork.getGasPrice()
    const { decimals } = await Asset.findById(transaction.assetId)

    const token = this.blockchainNetwork.getTokenContract(transaction.assetAddress, adminAccount.privateKey)
    const hash = await token.transferFrom({
      account: adminAccount.publicKey,
      from: transaction.walletAddress,
      to: (await Partner.findById(transaction.partnerId)).ethereumWallet,
      value: new BigNumber(transaction.value).multipliedBy(new BigNumber(Math.pow(10, decimals))).toString(),
      gasPrice,
    })

    await BlockchainJob.findByIdAndUpdate(
      job.blockchainJobId,
      {
        status: EBlockchainJobStatus.PROCESSING,
        excutedAt: new Date(TimeHelper.now()),
        adminAccountId: adminAccount.adminAccountId,
        hash,
      }
    )
  }

  private async getAdminAccount(partnerId: number) {
    const busyAccounts = await BlockchainJob.findAll(
      {
        status: EBlockchainJobStatus.PROCESSING,
        network: this.blockchainNetwork.network,
      },
      builder => builder
        .whereNot({ adminAccountId: null })
        .select('adminAccountId')
    )

    return AdminAccount.findOne(
      {
        isActive: true,
        network: this.blockchainNetwork.network,
        partnerId,
      },
      builder => builder.whereNotIn('adminAccountId', map(busyAccounts, 'adminAccountId'))
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
