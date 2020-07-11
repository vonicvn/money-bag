import { isNil } from 'lodash'
import {
  AdminAccount,
  BlockchainJob,
  EBlockchainJobStatus,
} from '../../global'

export async function assignJobs() {
  const remainJobs = await BlockchainJob.findAll(
    { status: EBlockchainJobStatus.JUST_CREATED },
    builder => builder.orderBy('created')
  )
  for (const job of remainJobs) {
    const adminAccount = await AdminAccount.findOne({
      currentJobId: null,
      network: job.network,
    })
    if (isNil(adminAccount)) return
    await AdminAccount.findByIdAndUpdate(adminAccount.adminAccountId, { currentJobId: job.blockchainJobId })
    await BlockchainJob.findByIdAndUpdate(job.blockchainJobId, { status: EBlockchainJobStatus.PROCESSING })
  }
}
