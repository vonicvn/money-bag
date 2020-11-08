import BigNumber from 'bignumber.js'
import { Web3InstanceManager, IAsset } from '../../../global'
import { Contract } from 'web3-eth/node_modules/web3-eth-contract'
import { IHotWalletContract } from '../metadata'
import { hotWalletAbi } from './hot-wallet-abi'

export class HotWalletContract implements IHotWalletContract {
  contract: Contract

  constructor(private address: string, privateKey: string) {
    const web3 = Web3InstanceManager.getWeb3ByKey(privateKey)
    this.contract = new web3.eth.Contract(
      hotWalletAbi,
      address
    )
  }

  async transfer(requestId: number, asset: IAsset, value: number, toAddress: string) {
    await this.ensureHasEnoughMoney(asset, value)
    const valueInWei = new BigNumber(value)
      .multipliedBy(Math.pow(10, asset.decimals))
      .integerValue(BigNumber.ROUND_DOWN)
      .toString()
    const transactionHash = await new Promise((resolve, reject) => {
      this.contract.methods.transfer(
        requestId,
        asset.address,
        valueInWei,
        toAddress
      )
        .send({})
        .on('transactionHash', resolve)
        .on('error', reject)
    })
    return transactionHash as string
  }

  private async ensureHasEnoughMoney(asset: IAsset, value: number) {
    const { balance: balanceInWei } = await this.contract.methods.getBalances(asset.address).call()
    const balance = new BigNumber(balanceInWei).dividedBy(Math.pow(10, asset.decimals)).toNumber()
    if (value <= balance) return
    throw new Error(`HOT_WALLET_OUT_OF_MONEY Hot wallet ${this.address} is out of token ${asset.name}`)
  }
}
