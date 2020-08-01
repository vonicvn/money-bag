import HDWalletProvider from '@truffle/hdwallet-provider'
import { ErrorHandler, Wallet, Env, EEnvKey, Redis } from '../global'
import { defaultTo, toLower } from 'lodash'

export class WalletService {
  public static isCreatingWallet = false

  async createWallet(quantity: number) {
    if (WalletService.isCreatingWallet) throw new Error('SERVICE_NOT_AVAILABLE')
    WalletService.isCreatingWallet = true
    try {
      await this.create(quantity)
    } catch (error) {
      ErrorHandler.handle(error)
    }
    WalletService.isCreatingWallet = false
  }

  private async create(quantity: number) {
    const wallet = await Wallet.findOne({}, builder => builder.orderBy('index', 'DESC'))
    for (let index = 0; index < quantity; index++) {
      const addressIndex = index + defaultTo(wallet, { index: -1 }).index + 1
      const address = toLower(await this.getAddressAtIndex(addressIndex))
      await Wallet.create({ address, index: addressIndex })
      await this.cacheAddressOnRedis(address)
    }
  }

  private async getAddressAtIndex(index: number) {
    return new HDWalletProvider(
      Env.get(EEnvKey.MNEMONIC),
      Env.INFURA_URL,
      index,
      1
    ).getAddress(0)
  }

  private cacheAddressOnRedis(address: string) {
    return Redis.setJson(`WALLET_${toLower(address)}`, true)
  }

  static async isAddressExisted(address: string) {
    return defaultTo(await Redis.getJson(`WALLET_${toLower(address)}`), false)
  }
}
