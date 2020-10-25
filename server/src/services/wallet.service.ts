import {
  ErrorHandler,
  Wallet,
  Redis,
  EBlockchainNetwork,
  BlockchainModule,
} from '../global'
import { defaultTo, toLower } from 'lodash'

export class WalletService {
  public static isCreatingWallet = false

  async createWallet(quantity: number, network: EBlockchainNetwork) {
    if (WalletService.isCreatingWallet) throw new Error('SERVICE_NOT_AVAILABLE')
    WalletService.isCreatingWallet = true
    try {
      await this.create(quantity, network)
    } catch (error) {
      ErrorHandler.handle(error)
    }
    WalletService.isCreatingWallet = false
  }

  private async create(quantity: number, network: EBlockchainNetwork) {
    const wallet = await Wallet.findOne({ network }, builder => builder.orderBy('index', 'DESC'))
    for (let index = 0; index < quantity; index++) {
      const addressIndex = index + defaultTo(wallet, { index: -1 }).index + 1
      const address = toLower(await this.getAddressAtIndex(addressIndex, network))
      await Wallet.create({ address, index: addressIndex, network })
      await this.cacheAddressOnRedis(address)
    }
  }

  private async getAddressAtIndex(index: number, network: EBlockchainNetwork) {
    const account = await BlockchainModule.get(network).generateAccount(index)
    return account.address
  }

  private cacheAddressOnRedis(address: string) {
    return Redis.setJson(`WALLET_${toLower(address)}`, true)
  }

  static async isAddressExisted(address: string) {
    return defaultTo(await Redis.getJson(`WALLET_${toLower(address)}`), false)
  }
}
