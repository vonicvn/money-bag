import { EBlockchainNetwork } from '../../global'
import { EthereumNetwork } from './ethereum-network'
import { TronNetwork } from './tron-network'

export class BlockchainModule {
  private static ethereum = new EthereumNetwork()
  private static tron = new TronNetwork()

  static get(network: EBlockchainNetwork) {
    if (network === EBlockchainNetwork.ETHEREUM) return this.ethereum
    return this.tron
  }
}
