import BigNumber from 'bignumber.js'
import {
  IJobProcessor,
  IJobCreator,
  IBlockchainJobInput,
  IJobChecker,
  IJobFinisher,
  IJobRetrier,
  IJobExcutor,
} from './metadata'
import {
  BlockchainJob,
  EBlockchainJobType,
  EBlockchainJobStatus,
  EBlockchainNetwork,
  IBlockchainJob,
  AdminAccount,
  WebInstanceManager,
  Transaction,
  Wallet,
  Partner,
} from '../../global'

export class JobCreator implements IJobCreator {
  async create({ transaction }: IBlockchainJobInput) {
    await BlockchainJob.create({
      transactionId: transaction.transactionId,
      network: EBlockchainNetwork.ETHEREUM,
      status: EBlockchainJobStatus.JUST_CREATED,
      type: EBlockchainJobType.TRANSFER_ALL_ETHEREUM,
    })
  }
}

export class JobFinisher implements IJobFinisher {
  async finish(job: IBlockchainJob) {
    await BlockchainJob.findByIdAndUpdate(
      job.blockchainJobId,
      { status: EBlockchainJobStatus.SUCCESS }
    )
    await AdminAccount.findOneAndUpdate(
      { currentJobId: job.blockchainJobId },
      { currentJobId: null }
    )
  }
}

export class JobChecker implements IJobChecker {
  async check(job: IBlockchainJob) {
    // awaz
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
    const { ethereumWallet } = await Partner.findById(partnerId)
    const web3 = WebInstanceManager.getWeb3ByWalletIndex(index)
    const [account] = await web3.eth.getAccounts()

    const balance = await web3.eth.getBalance(account)
    const gasPrice = await web3.eth.getGasPrice()
    const GAS_LIMIT = 21000
    const nonce = await web3.eth.getTransactionCount(account)
    const hash = await new Promise<string>((resolve, reject) => {
      web3.eth.sendTransaction({
        from: account,
        value: new BigNumber(balance).minus(new BigNumber(GAS_LIMIT).multipliedBy(gasPrice)).toString(),
        to: ethereumWallet,
        gasPrice,
        nonce,
      })
      .on('transactionHash', resolve)
      .on('error', reject)
    })
    await BlockchainJob.findByIdAndUpdate(
      job.blockchainJobId,
      { hash, status: EBlockchainJobStatus.PROCESSING }
    )
  }
}

export class Processor implements IJobProcessor {
  creator = new JobCreator()
  finisher = new JobFinisher()
  checker = new JobChecker()
  retrier = new JobRetrier()
  excutor = new JobExcutor()
}
