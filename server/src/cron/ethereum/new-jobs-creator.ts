import {
  Transaction,
  ECollectingStatus,
  ITransaction,
  EDefaultAssetId,
  Erc20Token,
} from '../../global'
import {
  TransferAllEthereumProcessor,
  IJobProcessor,
  TransferEthereumToSendApproveRequestErc20,
  SendApproveRequestErc20,
} from '../job-processor'

export class NewJobsCreator {
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
    if (transaction.assetId === EDefaultAssetId.ETH) return new TransferAllEthereumProcessor()
    if (transaction.assetId === EDefaultAssetId.BTC) return new TransferAllEthereumProcessor()
    return this.getJobProcessorForErc20(transaction)
  }

  private async getJobProcessorForErc20(transaction: ITransaction): Promise<IJobProcessor> {
    const isApproved = await new Erc20Token(transaction.assetAddress).isApproved(transaction.walletAddress)
    if (isApproved) return new SendApproveRequestErc20()
    return new TransferEthereumToSendApproveRequestErc20()
  }
}
