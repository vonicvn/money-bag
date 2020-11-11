import { isNil, map } from 'lodash'
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
  EBlockchainTransactionStatus,
  TimeHelper,
  IBlockchainNetwork,
  AdminAccount,
  EAdminAccountType,
  Asset,
  EWithdrawalStatus,
  Withdrawal,
  Env,
  ESwitchableFeature,
} from '../../../global'

export class JobCreator implements IJobCreator {
  constructor(public blockchainNetwork: IBlockchainNetwork) {}

  async create({ withdrawal }: IBlockchainJobInput) {
    const job = await BlockchainJob.create({
      transactionId: withdrawal.withdrawalId,
      network: this.blockchainNetwork.network,
      status: EBlockchainJobStatus.JUST_CREATED,
      type: EBlockchainJobType.WITHDRAW_FROM_HOT_WALLET,
    })
    console.log(`[CREATE NEW JOB]: ${JSON.stringify(job)}`)
  }
}

export class JobFinisher implements IJobFinisher {
  constructor(public blockchainNetwork: IBlockchainNetwork) {}

  async finish(job: IBlockchainJob) {
    const response = await this.blockchainNetwork.getTransactionReceipt(job.hash)
    if (isNil(response)) return
    const { blockNumber } = response
    await BlockchainJob.findByIdAndUpdate(
      job.blockchainJobId,
      { status: EBlockchainJobStatus.SUCCESS, block: blockNumber }
    )
    await Withdrawal.findByIdAndUpdate(
      job.transactionId,
      {
        status: EWithdrawalStatus.SUCCESS,
        hash: job.hash,
      }
    )
  }
}

export class JobChecker implements IJobChecker {
  constructor(public blockchainNetwork: IBlockchainNetwork) {}

  static RETRY_AFTER = 3 * 60 * 1000 // 3 minutes
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
    if (Env.isFeatureDisabled(ESwitchableFeature.WITHDRAW_TO_HOT_WALLET)) return
    console.log('[START EXCUTE]', job)
    const withdrawal = await Withdrawal.findById(job.transactionId)
    const adminAccount = await this.getAdminAccount(withdrawal.partnerId)
    if (isNil(adminAccount)) return

    const hotWallet = await this.blockchainNetwork
      .getHotWallet(
        withdrawal.partnerId,
        adminAccount.privateKey
      )
    const asset = await Asset.findById(withdrawal.assetId)
    const hash = await hotWallet.transfer(
      withdrawal.requestId,
      asset,
      withdrawal.value,
      withdrawal.toAddress
    )

    await BlockchainJob.findByIdAndUpdate(
      job.blockchainJobId,
      {
        status: EBlockchainJobStatus.PROCESSING,
        adminAccountId: adminAccount.adminAccountId,
        excutedAt: new Date(TimeHelper.now()),
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
        type: EAdminAccountType.WITHDRAW,
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
