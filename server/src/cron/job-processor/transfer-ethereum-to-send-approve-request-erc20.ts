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
  Web3InstanceManager,
  Transaction,
  Wallet,
  EEthereumTransactionStatus,
  TimeHelper,
  Env,
  AdminAccount,
  Erc20Token,
  Asset,
} from '../../global'

export class JobCreator implements IJobCreator {
  async create({ transaction }: IBlockchainJobInput) {
    const job = await BlockchainJob.create({
      transactionId: transaction.transactionId,
      network: EBlockchainNetwork.ETHEREUM,
      status: EBlockchainJobStatus.JUST_CREATED,
      type: EBlockchainJobType.TRANSFER_ETHEREUM_TO_SEND_APPROVE_REQUEST_ERC20,
    })
    console.log(`[CREATE NEW JOB]: ${JSON.stringify(job)}`)
  }
}

export class JobFinisher implements IJobFinisher {
  async finish(job: IBlockchainJob) {
    if (job.status === EBlockchainJobStatus.PROCESSING) this.finishSuccessJob(job)
    if (job.status === EBlockchainJobStatus.SKIPPED) this.finishSkippedJob(job)

    const { walletId } = await Transaction.findById(job.transactionId)
    const newJob = await BlockchainJob.create({
      transactionId: job.transactionId,
      network: EBlockchainNetwork.ETHEREUM,
      status: EBlockchainJobStatus.JUST_CREATED,
      type: EBlockchainJobType.SEND_APPROVE_REQUEST_ERC20,
      walletId,
    })
    console.log(`[CREATE NEW JOB]: ${JSON.stringify(newJob)}`)
  }

  async finishSuccessJob(job: IBlockchainJob) {
    const { blockNumber } = await Web3InstanceManager.defaultWeb3.eth.getTransactionReceipt(job.hash)
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

  async check(job: IBlockchainJob) {
    if (job.status === EBlockchainJobStatus.JUST_CREATED) {
      return EJobAction.EXCUTE
    }
    if (job.status === EBlockchainJobStatus.SKIPPED) {
      return EJobAction.FINISH
    }
    const status = await this.getEthereumNetworkTransactionStatus(job.hash)
    console.log(`[ETHEREUM STATUS] Job ${job.blockchainJobId} hash ${job.hash} status ${status}`)
    if (status === EEthereumTransactionStatus.SUCCESS) return EJobAction.FINISH
    if (status === EEthereumTransactionStatus.WAIT_FOR_MORE_COMFIRMATIONS) return EJobAction.WAIT
    if (status === EEthereumTransactionStatus.PENDING) {
      const shouldWaitMore = TimeHelper.smallerThan(
        TimeHelper.now(),
        TimeHelper.after(JobChecker.RETRY_AFTER)
      )
      if (shouldWaitMore) return EJobAction.WAIT
      return EJobAction.RETRY
    }
    if (status === EEthereumTransactionStatus.FAILED) return EJobAction.RETRY
  }

  private async getEthereumNetworkTransactionStatus(transactionHash: string) {
    const receipt = await Web3InstanceManager.defaultWeb3.eth.getTransactionReceipt(transactionHash)
    if (isNil(receipt)) return EEthereumTransactionStatus.PENDING
    if (receipt.status) {
      const currentBlock = await Web3InstanceManager.defaultWeb3.eth.getBlockNumber()
      const shouldWaitForMoreConfirmations = currentBlock - receipt.blockNumber < Env.SAFE_NUMBER_OF_COMFIRMATION
      if (shouldWaitForMoreConfirmations) return EEthereumTransactionStatus.WAIT_FOR_MORE_COMFIRMATIONS
      return EEthereumTransactionStatus.SUCCESS
    }
    return EEthereumTransactionStatus.FAILED
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
  async excute(job: IBlockchainJob) {
    const transaction = await Transaction.findOne({ transactionId: job.transactionId })
    const { address: walletAddress } = await Wallet.findById(transaction.walletId)
    const adminAccount = await this.getAdminAccount(transaction.partnerId)
    if (isNil(adminAccount)) {
      return
    }
    const isApproved = await new Erc20Token(transaction.assetAddress).isApproved(transaction.walletAddress)
    if (isApproved) {
      await BlockchainJob.findByIdAndUpdate(
        job.blockchainJobId,
        {
          status: EBlockchainJobStatus.SKIPPED,
          excutedAt: new Date(TimeHelper.now()),
          adminAccountId: adminAccount.adminAccountId,
        }
      )
      return
    }

    console.log('[START EXCUTE]', job)
    const web3 = Web3InstanceManager.getWeb3ByKey(adminAccount.privateKey)
    const [account] = await web3.eth.getAccounts()

    const { address: tokenAddress } = await Asset.findById(transaction.assetId)
    const value = await this.getValueToTransfer(tokenAddress, account)
    const gasPrice = await Web3InstanceManager.defaultWeb3.eth.getGasPrice()
    const nonce = await Web3InstanceManager.defaultWeb3.eth.getTransactionCount(account)

    const hash = await new Promise<string>((resolve, reject) => {
      web3.eth.sendTransaction({
        from: account,
        value,
        to: walletAddress,
        nonce,
        gasPrice: new BigNumber(gasPrice)
          .multipliedBy(1.3)
          .integerValue(BigNumber.ROUND_CEIL)
          .toNumber(),
      })
        .on('transactionHash', resolve)
        .on('error', reject)
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

  private async getValueToTransfer(tokenAddress: string, account: string) {
    const gasLimitForApproveRequest = await new Erc20Token(tokenAddress).getGasLimitForApproving(account)
    const currentGasPrice = await Web3InstanceManager.defaultWeb3.eth.getGasPrice()
    return new BigNumber(gasLimitForApproveRequest)
      .multipliedBy(currentGasPrice)
      .multipliedBy(1.3)
      .integerValue(BigNumber.ROUND_CEIL)
      .toNumber()
  }

  private async getAdminAccount(partnerId: number) {
    const busyAccounts = await BlockchainJob.findAll(
      {
        status: EBlockchainJobStatus.PROCESSING,
        network: EBlockchainNetwork.ETHEREUM,
      },
      builder => builder
        .whereNot({ adminAccountId: null })
        .select('adminAccountId')
    )

    return AdminAccount.findOne(
      {
        isActive: true,
        network: EBlockchainNetwork.ETHEREUM,
        partnerId,
      },
      builder => builder.whereNotIn('adminAccountId', map(busyAccounts, 'adminAccountId'))
    )
  }
}

export class JobProcessor implements IJobProcessor {
  creator = new JobCreator()
  finisher = new JobFinisher()
  checker = new JobChecker()
  retrier = new JobRetrier()
  excutor = new JobExcutor()
}
