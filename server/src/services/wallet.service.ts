import * as bip39 from 'bip39'
import { ErrorHandler, Wallet, Env, EEnvKey, Redis } from '../global'
import { defaultTo, toLower } from 'lodash'
// tslint:disable-next-line: no-require-imports
const { hdkey } = require('ethereumjs-wallet')

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
    const seed = await bip39.mnemonicToSeed(Env.get(EEnvKey.MNEMONIC))
    const hdwallet = hdkey.fromMasterSeed(seed)
    const path = `m/44'/60'/0'/0/`
    const wallet = hdwallet.derivePath(path + index).getWallet()
    return '0x' + wallet.getAddress().toString('hex')
  }

  private cacheAddressOnRedis(address: string) {
    return Redis.setJson(`WALLET_${toLower(address)}`, true)
  }

  static async isAddressExisted(address: string) {
    return defaultTo(await Redis.getJson(`WALLET_${toLower(address)}`), false)
  }
}
