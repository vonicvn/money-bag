import {
  Transaction,
  ECollectingStatus,
  ITransaction,
  EDefaultAssetId,
  Erc20Token,
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

  async create() {
    const transactions = await Transaction.findAll({ collectingStatus: ECollectingStatus.WAITING })
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
    if (transaction.assetId === EDefaultAssetId.ETH) return new TransferAllEthereumProcessor(BlockchainModule.get(this.network))
    if (transaction.assetId === EDefaultAssetId.BTC) return new TransferAllEthereumProcessor(BlockchainModule.get(this.network))
    return this.getJobProcessorForErc20(transaction)
  }

  private async getJobProcessorForErc20(transaction: ITransaction): Promise<IJobProcessor> {
    const isApproved = await new Erc20Token(transaction.assetAddress).isApproved(transaction.walletAddress)
    if (isApproved) return new SendTransferFromRequestErc20(BlockchainModule.get(this.network))
    return new TransferEthereumToSendApproveRequestErc20(BlockchainModule.get(this.network))
  }
}
