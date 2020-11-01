import {
  Transaction,
  ECollectingStatus,
  ITransaction,
  EDefaultAssetId,
  BlockchainModule,
  EBlockchainNetwork,
} from '../../global'
import {
  TransferAllEthereumProcessor,
  IJobProcessor,
  TransferEthereumToSendApproveRequestErc20,
  SendTransferFromRequestErc20,
} from './job-processor'

export class NewJobsCreator {
  constructor(private network: EBlockchainNetwork) {}

  private get blockchainModule() {
    return BlockchainModule.get(this.network)
  }

  async create() {
    const transactions = await Transaction.findAll({
      collectingStatus: ECollectingStatus.WAITING,
      network: this.network,
    })
    for (const transaction of transactions) {
      const { creator } = await this.getJobProcessor(transaction)
      await creator.create({ transaction })
      await Transaction.findByIdAndUpdate(
        transaction.transactionId,
        { collectingStatus: ECollectingStatus.PROCESSING }
      )
    }
  }

  private async getJobProcessor(transaction: ITransaction): Promise<IJobProcessor> {
    if (transaction.assetId === EDefaultAssetId.ETH) return new TransferAllEthereumProcessor(this.blockchainModule)
    return this.getJobProcessorForErc20(transaction)
  }

  private async getJobProcessorForErc20(transaction: ITransaction): Promise<IJobProcessor> {
    const isApproved = await this.blockchainModule
      .getTokenContract(transaction.assetAddress)
      .isApproved(transaction.walletAddress)

    if (isApproved) return new SendTransferFromRequestErc20(this.blockchainModule)
    return new TransferEthereumToSendApproveRequestErc20(this.blockchainModule)
  }
}
