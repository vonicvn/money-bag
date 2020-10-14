import { Web3InstanceManager } from '../../global'
import { IBlockchainNetwork } from '../blockchain-network.module'
import { TransactionsGetter } from './transaction-getter'
import { TransactionStatusGetter } from './transaction-status-getter'

export class EthereumNetwork implements IBlockchainNetwork {
  getBlockNumber() {
    return Web3InstanceManager.defaultWeb3.eth.getBlockNumber()
  }

  getTransactions(block: number) {
    return new TransactionsGetter(block).get()
  }

  async getTransactionStatus(hash: string) {
    return new TransactionStatusGetter().get(hash)
  }

  getTransactionReceipt(hash: string) {
    return Web3InstanceManager.defaultWeb3.eth.getTransactionReceipt(hash)
  }
}
