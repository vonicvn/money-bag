import { OneAtMomemnt } from '../one-at-moment'
import { NewTransactionsLoader } from './new-transactions-loader'
import { NewJobsCreator } from './new-jobs-creator'
import { IncompleteJobsChecker } from './incomplete-jobs-checker'

// 1. Scan ethereum transaction
// 2. New transactions -> create new jobs
// 3. Scan in_progress jobs -> create new jobs
// 4. Assign jobs to admin accounts

export class Scanner extends OneAtMomemnt {
  protected async do() {
    await new NewTransactionsLoader().load()
    await new NewJobsCreator().create()
    await new IncompleteJobsChecker().checkAll()
  }
}
