import {
  AdminAccount,
  BlockchainJob,
  EBlockchainJobStatus,
  IBlockchainJob,
} from '../../global'

export async function finishJob(job: IBlockchainJob) {
  await BlockchainJob.findByIdAndUpdate(job.blockchainJobId, { status: EBlockchainJobStatus.SUCCESS })
  await AdminAccount.findOneAndUpdate({ currentJobId: job.blockchainJobId }, { currentJobId: null })
}
