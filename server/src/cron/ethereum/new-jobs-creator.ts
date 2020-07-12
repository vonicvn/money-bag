import {
  Transaction,
  ECollectingStatus,
  ITransaction,
  EDefaultAssetId,
} from '../../global'
import {
  TransferAllEthereumProcessor,
  IJobProcessor,
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
    // TODO: implement
    if (transaction.assetId === EDefaultAssetId.ETH) return new TransferAllEthereumProcessor()
    if (transaction.assetId === EDefaultAssetId.BTC) return new TransferAllEthereumProcessor()
  }
}
