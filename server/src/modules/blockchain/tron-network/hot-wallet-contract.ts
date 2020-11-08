import BigNumber from 'bignumber.js'
import { IAsset } from '../../../global'
import { IHotWalletContract } from '../metadata'
import { TronWebInstance } from './tron-web-instance'

export class HotWalletContract implements IHotWalletContract {
  // tslint:disable-next-line: no-any
  private contract: any

  constructor(private address: string, private privateKey: string) { }

  private async init() {
    const tronWeb = await TronWebInstance.getByPrivateKey(this.privateKey)
    this.contract = await tronWeb
      .contract()
      .at(this.address)
  }

  async transfer(requestId: number, asset: IAsset, value: number, toAddress: string) {
    await this.init()
    await this.ensureHasEnoughMoney(asset, value)
    await this.ensureNotPaid(requestId)

    const valueInWei = new BigNumber(value)
      .multipliedBy(Math.pow(10, asset.decimals))
      .integerValue(BigNumber.ROUND_DOWN)
      .toString()

    const txID = await this.contract.transfer(
      requestId,
      asset.address,
      valueInWei,
      toAddress
    ).send({})

    return txID
  }

  private async ensureHasEnoughMoney(asset: IAsset, value: number) {
    const { balance: balanceInWei } = await this.contract.getBalances(asset.address).call()
    const balance = new BigNumber(balanceInWei).dividedBy(Math.pow(10, asset.decimals)).toNumber()
    if (value <= balance) return
    throw new Error(`HOT_WALLET_OUT_OF_MONEY Hot wallet ${this.address} is out of token ${asset.name}`)
  }

  private async ensureNotPaid(requestId: number) {
    const isTransactionRequestPaid = await this.contract.isPaid(requestId).call()
    if (isTransactionRequestPaid) {
      throw new Error(`TRANSACTION_REQUEST_PAID Hot wallet ${this.address} requestId = ${requestId}`)
    }
  }
}
