import { OneAtMomemnt } from '../one-at-moment'
import { NewTransactionsLoader } from './new-transactions-loader'
import { NewJobsCreator } from './new-jobs-creator'
import { IncompleteJobsChecker } from './incomplete-jobs-checker'

export class Scanner extends OneAtMomemnt {
  protected async do() {
    await new NewTransactionsLoader().load()
    // await new NewJobsCreator().create()
    // await new IncompleteJobsChecker().checkAll()
  }
}
