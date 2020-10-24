import * as bip39 from 'bip39'
import {
  ErrorHandler,
  Wallet,
  Env,
  EEnvKey,
  Redis,
  EBlockchainNetwork,
} from '../global'
import { defaultTo, toLower } from 'lodash'
const { hdkey } = require('ethereumjs-wallet')

export class WalletService {
  public static isCreatingWallet = false

  async createWallet(quantity: number, network = EBlockchainNetwork.ETHEREUM) {
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
    const wallet = await Wallet.findOne({}, builder => builder.orderBy('index', 'DESC'))
    for (let index = 0; index < quantity; index++) {
      const addressIndex = index + defaultTo(wallet, { index: -1 }).index + 1
      const address = toLower(await this.getAddressAtIndex(addressIndex, network))
      await Wallet.create({ address, index: addressIndex })
      await this.cacheAddressOnRedis(address)
    }
  }

  private async getAddressAtIndex(index: number, network: EBlockchainNetwork) {
    if (network === EBlockchainNetwork.ETHEREUM) {
      return new EthereumAddressProvider().getAddressAtIndex(index)
    }
    return new TronAddressProvider().getAddressAtIndex(index)
  }

  private cacheAddressOnRedis(address: string) {
    return Redis.setJson(`WALLET_${toLower(address)}`, true)
  }

  static async isAddressExisted(address: string) {
    return defaultTo(await Redis.getJson(`WALLET_${toLower(address)}`), false)
  }
}

class EthereumAddressProvider {
  async getAddressAtIndex(index: number) {
    const seed = await bip39.mnemonicToSeed(Env.get(EEnvKey.MNEMONIC))
    const hdwallet = hdkey.fromMasterSeed(seed)
    const path = `m/44'/60'/0'/0/`
    const wallet = hdwallet.derivePath(path + index).getWallet()
    return '0x' + wallet.getAddress().toString('hex')
  }
}
