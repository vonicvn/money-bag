import { defaultTo } from 'lodash'
import {
  Redis,
  ITransaction,
  Transaction,
  web3,
  ETransactionStatus,
  BlockchainJobService,
  BlockchainJob,
  EBlockchainJobStatus,
} from '../global'
import { OneAtMomemnt } from './one-at-moment'
import { EthereumTransactionsGetter } from './ethereum-transactions-getter'

// 1. Scan ethereum transaction
// 2. New transactions -> create new jobs
// 3. Scan in_progress jobs -> create new jobs
// 4. Assign jobs to admin accounts
// 5. Process all assigned jobs

export abstract class EthereumScanner extends OneAtMomemnt {
  static SAFE_NUMBER_OF_COMFIRMATION = 0

  protected async do() {
    await this.detechNewTransactions()
    await this.createJobsForNewTransactions()
  }

  private async detechNewTransactions() {
    const currentBlock = await web3.eth.getBlockNumber()
    const scannedBlock = defaultTo(
      await Redis.getJson<number>('ETHEREUM_SCANNED_BLOCK'),
      currentBlock - EthereumScanner.SAFE_NUMBER_OF_COMFIRMATION - 1
    )

    for (
      let block = scannedBlock + 1;
      block <= currentBlock - EthereumScanner.SAFE_NUMBER_OF_COMFIRMATION;
      block++
    ) {
      const transactions = await this.scanBlock(block)
      await Transaction.createMany(transactions)
      await Redis.setJson<number>('ETHEREUM_SCANNED_BLOCK', block)
    }
  }

  private async scanBlock(block: number): Promise<Partial<ITransaction>[]> {
    return new EthereumTransactionsGetter(block).get()
  }

  private async createJobsForNewTransactions() {
    const detectedTransactions = await Transaction.findAll({ status: ETransactionStatus.DETECTED })
    for (const transaction of detectedTransactions) {
      await BlockchainJobService.createJob({ transaction })
      await Transaction.findByIdAndUpdate(transaction.transactionId, { status: ETransactionStatus.PROCESSING })
    }
  }

  private async scanProccessingJobs() {
    const jobs = await BlockchainJob.findAll({ status: EBlockchainJobStatus.PROCESSING })
    for (const job of jobs) {
      //
    }
  }
}
