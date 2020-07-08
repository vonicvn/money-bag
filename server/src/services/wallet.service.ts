import Web3 from 'web3'
import HDWalletProvider from '@truffle/hdwallet-provider'
import { ErrorHandler, Wallet, Env, EEnvKey } from '../global'
import { defaultTo } from 'lodash'

export class WalletService {
  public static isCreatingWallet = false

  async createWallet(partnerId: number, quantity: number) {
    if (WalletService.isCreatingWallet) throw new Error('SERVICE_NOT_AVAILABLE')
    WalletService.isCreatingWallet = true
    try {
      await this.create(partnerId, quantity)
    } catch (error) {
      ErrorHandler.handle(error)
    }
    WalletService.isCreatingWallet = false
  }

  private async create(partnerId: number, quantity: number) {
    const wallet = await Wallet.findOne({}, builder => builder.orderBy('index', 'DESC'))
    for (let index = 0; index < quantity; index++) {
      const addressIndex = index + defaultTo(wallet, { index }).index + 1
      const address = await this.getAddressAtIndex(addressIndex)
      await Wallet.create({ address, index: addressIndex, partnerId })
    }
  }

  private async getAddressAtIndex(index: number) {
    // tslint:disable-next-line: no-any
    const walletProvider: any = new HDWalletProvider(
      Env.get(EEnvKey.MNEMONIC),
      Env.get(EEnvKey.INFURA_URL),
      index,
      1
    )
    const [result] = await new Web3(walletProvider).eth.getAccounts()
    return result
  }
}