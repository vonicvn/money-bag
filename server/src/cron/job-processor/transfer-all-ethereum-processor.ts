import {
  IJobProcessor,
  IJobCreator,
  IBlockchainJobInput,
  IJobChecker,
  IJobFinisher,
  IJobRetrier,
} from './metadata'
import {
  BlockchainJob,
  EBlockchainJobType,
  EBlockchainJobStatus,
  EBlockchainNetwork,
  IBlockchainJob,
  AdminAccount,
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
    await BlockchainJob.findByIdAndUpdate(job.blockchainJobId, { status: EBlockchainJobStatus.SUCCESS })
    await AdminAccount.findOneAndUpdate({ currentJobId: job.blockchainJobId }, { currentJobId: null })
  }
}

export class JobChecker implements IJobChecker {
  async check(job: IBlockchainJob) {
    //
  }
}

export class JobRetrier implements IJobRetrier {
  async retry(job: IBlockchainJob) {
    //
  }
}

export class Processor implements IJobProcessor {
  creator = new JobCreator()
  finisher = new JobFinisher()
  checker = new JobChecker()
  retrier = new JobRetrier()
}
