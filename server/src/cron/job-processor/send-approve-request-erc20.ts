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
  Web3InstanceManager,
  Transaction,
  Wallet,
  EEthereumTransactionStatus,
  TimeHelper,
  Env,
  Erc20Token,
} from '../../global'

export class JobFinisher implements IJobFinisher {
  async finish(job: IBlockchainJob) {
    if (job.status !== EBlockchainJobStatus.SKIPPED) {
      const { blockNumber } = await Web3InstanceManager.defaultWeb3.eth.getTransactionReceipt(job.hash)
      await BlockchainJob.findByIdAndUpdate(
        job.blockchainJobId,
        { status: EBlockchainJobStatus.SUCCESS, block: blockNumber }
      )
    }
    const newJob = await BlockchainJob.create({
      transactionId: job.transactionId,
      network: EBlockchainNetwork.ETHEREUM,
      status: EBlockchainJobStatus.JUST_CREATED,
      type: EBlockchainJobType.SEND_TRANSFER_FROM_REQUEST_ERC20,
    })
    console.log(`[CREATE NEW JOB]: ${JSON.stringify(newJob)}`)
  }
}

export class JobChecker implements IJobChecker {
  static RETRY_AFTER = 3 * 60 * 1000 // 3 minutes
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
  async excute(job: IBlockchainJob) {
    console.log('[START EXCUTE]', job)
    const transaction = await Transaction.findOne({ transactionId: job.transactionId })
    const isApproved = await new Erc20Token(transaction.assetAddress).isApproved(transaction.walletAddress)
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
    const web3 = Web3InstanceManager.getWeb3ByWalletIndex(index)
    const [account] = await web3.eth.getAccounts()
    const gasPrice = await this.getGasPrice(job)
    const hash = await new Erc20Token(transaction.assetAddress, web3).approve(account, gasPrice)
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
    const gasLimitForApproveRequest = await new Erc20Token(transaction.assetAddress)
      .getGasLimitForApproving(transaction.walletAddress)
    const { hash } = await BlockchainJob.findOne({
      transactionId: job.transactionId,
      type: EBlockchainJobType.TRANSFER_ETHEREUM_TO_SEND_APPROVE_REQUEST_ERC20,
    })
    const { value } = await Web3InstanceManager.defaultWeb3.eth.getTransaction(hash)
    return new BigNumber(value)
      .dividedBy(gasLimitForApproveRequest)
      .integerValue(BigNumber.ROUND_DOWN)
      .toNumber()
  }
}

export class JobProcessor implements IJobProcessor {
  finisher = new JobFinisher()
  checker = new JobChecker()
  retrier = new JobRetrier()
  excutor = new JobExcutor()
}
