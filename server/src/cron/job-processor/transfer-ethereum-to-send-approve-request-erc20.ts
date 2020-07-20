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
  EBlockchainNetwork,
  IBlockchainJob,
  Web3InstanceManager,
  Transaction,
  Wallet,
  Partner,
  web3,
  EEthereumTransactionStatus,
  TimeHelper,
  Env,
  AdminAccount,
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
    const { blockNumber } = await web3.eth.getTransactionReceipt(job.hash)
    await BlockchainJob.findByIdAndUpdate(
      job.blockchainJobId,
      { status: EBlockchainJobStatus.SUCCESS, block: blockNumber }
    )

    const newJob = await BlockchainJob.create({
      transactionId: job.transactionId,
      network: EBlockchainNetwork.ETHEREUM,
      status: EBlockchainJobStatus.JUST_CREATED,
      type: EBlockchainJobType.SEND_APPROVE_REQUEST_ERC20,
    })
    console.log(`[CREATE NEW JOB]: ${JSON.stringify(newJob)}`)
  }
}

export class JobChecker implements IJobChecker {
  static RETRY_AFTER = 3 * 60 * 1000 // 3 minutes

  async check(job: IBlockchainJob) {
    if (job.status === EBlockchainJobStatus.JUST_CREATED) {
      return EJobAction.EXCUTE
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
    const receipt = await web3.eth.getTransactionReceipt(transactionHash)
    if (isNil(receipt)) return EEthereumTransactionStatus.PENDING
    if (receipt.status) {
      const currentBlock = await web3.eth.getBlockNumber()
      const shouldWaitForMoreConfirmations = currentBlock - receipt.blockNumber < Env.SAFE_NUMBER_OF_COMFIRMATION
      if (shouldWaitForMoreConfirmations) return EEthereumTransactionStatus.WAIT_FOR_MORE_COMFIRMATIONS
      return EEthereumTransactionStatus.SUCCESS
    }
    return EEthereumTransactionStatus.FAILED
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
  async excute(job: IBlockchainJob) {
    const transaction = await Transaction.findOne({ transactionId: job.transactionId })
    const { index, partnerId } = await Wallet.findById(transaction.walletId)
    const web3 = Web3InstanceManager.getWeb3ByWalletIndex(index)
    const [account] = await web3.eth.getAccounts()

    const balance = await web3.eth.getBalance(account)
    const gasPrice = await web3.eth.getGasPrice()
    const GAS_LIMIT = 21000
    const nonce = await web3.eth.getTransactionCount(account)
    const { ethereumWallet } = await Partner.findById(partnerId)

    const hash = await new Promise<string>((resolve, reject) => {
      web3.eth.sendTransaction({
        from: account,
        value: new BigNumber(balance).minus(new BigNumber(GAS_LIMIT).multipliedBy(gasPrice)).toString(),
        to: ethereumWallet,
        gasPrice: new BigNumber(gasPrice).multipliedBy(1.3).toNumber(),
        nonce,
      })
        .on('transactionHash', resolve)
        .on('error', reject)
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
  creator = new JobCreator()
  finisher = new JobFinisher()
  checker = new JobChecker()
  retrier = new JobRetrier()
  excutor = new JobExcutor()
}
