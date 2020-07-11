import { createJob } from './create-job'
import { assignJobs } from './assign-job'

export class BlockchainJobService {
  static createJob = createJob
  static assignJobs = assignJobs
}
