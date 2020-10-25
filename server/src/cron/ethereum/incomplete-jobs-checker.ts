import {
  BlockchainJob,
  IBlockchainJob,
  EBlockchainJobStatus,
  EBlockchainJobType,
  BlockchainModule,
  IBlockchainNetwork,
  EBlockchainNetwork,
} from '../../global'
import {
  TransferAllEthereumProcessor,
  IJobProcessor,
  EJobAction,
  TransferEthereumToSendApproveRequestErc20,
  SendApproveRequestErc20,
  SendTransferFromRequestErc20,
} from './job-processor'

export class IncompleteJobsChecker {
  constructor(private network: EBlockchainNetwork) {}

  async checkAll() {
    const jobs = await BlockchainJob.findAll({}, builder => {
      return builder
        .whereNotIn('status', [
          EBlockchainJobStatus.SUCCESS,
          EBlockchainJobStatus.CANCELED,
        ])
        .orderBy('transactionId', 'DESC')
    })
    for (const job of jobs) {
      const { checker, retrier, finisher, excutor } = await this.getJobProcessor(job)
      const action = await checker.check(job)
      if (action !== EJobAction.EXCUTE) {
        console.log(`[JOB ACTION] ${action} on job ${job.blockchainJobId} current status ${job.status}`)
      }
      if (action === EJobAction.WAIT) continue
      if (action === EJobAction.RETRY) {
        await retrier.retry(job)
        continue
      }
      if (action === EJobAction.FINISH) {
        await finisher.finish(job)
        continue
      }
      if (action === EJobAction.EXCUTE) {
        await excutor.excute(job)
        continue
      }
    }
  }

  private async getJobProcessor(job: IBlockchainJob): Promise<IJobProcessor> {
    const jobTypeToProcessor: { [key: string]: { new (blockchainNetwork: IBlockchainNetwork): IJobProcessor } } = {
      [EBlockchainJobType.TRANSFER_ALL_ETHEREUM]: TransferAllEthereumProcessor,
      [EBlockchainJobType.TRANSFER_ETHEREUM_TO_SEND_APPROVE_REQUEST_ERC20]: TransferEthereumToSendApproveRequestErc20,
      [EBlockchainJobType.SEND_APPROVE_REQUEST_ERC20]: SendApproveRequestErc20,
      [EBlockchainJobType.SEND_TRANSFER_FROM_REQUEST_ERC20]: SendTransferFromRequestErc20,
    }
    return new jobTypeToProcessor[job.type as string](BlockchainModule.get(this.network))
  }
}
