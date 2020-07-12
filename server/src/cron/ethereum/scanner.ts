import {
  Transaction,
  ETransactionStatus,
  BlockchainJobService,
  BlockchainJob,
  EBlockchainJobStatus,
} from '../../global'
import {
  OneAtMomemnt,
} from '../one-at-moment'
import { NewTransactionsLoader } from './new-transactions-loader'

// 1. Scan ethereum transaction
// 2. New transactions -> create new jobs
// 3. Scan in_progress jobs -> create new jobs
// 4. Assign jobs to admin accounts
// 5. Process all assigned jobs

export abstract class Scanner extends OneAtMomemnt {
  static SAFE_NUMBER_OF_COMFIRMATION = 0

  protected async do() {
    await new NewTransactionsLoader().load()
    await this.createJobsForNewTransactions()
  }

  private async createJobsForNewTransactions() {
    // const detectedTransactions = await Transaction.findAll({ collectingStatus: ETransactionStatus.WAITING })
    // for (const transaction of detectedTransactions) {
    //   await BlockchainJobService.createJob({ transaction })
    //   await Transaction.findByIdAndUpdate(transaction.transactionId, { status: ETransactionStatus.PROCESSING })
    // }
  }

  private async scanProccessingJobs() {
    const jobs = await BlockchainJob.findAll({}, builder => {
      return builder.whereNotIn('status', [EBlockchainJobStatus.SUCCESS, EBlockchainJobStatus.CANCELED])
    })
    for (const job of jobs) {
      //
    }
  }

  private getJobProcessorByTransaction() {
    //
  }
}
