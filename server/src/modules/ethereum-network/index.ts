import { Web3InstanceManager } from '../../global'
import { IBlockchainNetwork } from '../blockchain-network.module'
import { TransactionsGetter } from './transaction-getter'

export class EthereumNetwork implements IBlockchainNetwork {
  getBlockNumber() {
    return Web3InstanceManager.defaultWeb3.eth.getBlockNumber()
  }

  getTransactions(block: number) {
    return new TransactionsGetter(block).get()
  }
}
