import { OneAtMomemnt } from '../one-at-moment'
import { NewTransactionsLoader } from './new-transactions-loader'
import { NewJobsCreator } from './new-jobs-creator'
import { IncompleteJobsChecker } from './incomplete-jobs-checker'
import { EBlockchainNetwork } from '../../global'

export class Scanner extends OneAtMomemnt {
  constructor(private network: EBlockchainNetwork) {
    super()
  }

  protected async do() {
    // await new NewTransactionsLoader(this.network).load()
    await new NewJobsCreator(this.network).create()
    await new IncompleteJobsChecker(this.network).checkAll()
  }
}
