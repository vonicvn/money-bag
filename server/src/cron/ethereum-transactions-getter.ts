import BigNumber from 'bignumber.js'
import { compact, toLower, isNil } from 'lodash'
import {
  ITransaction, web3, WalletService, Wallet,
  EDefaultWalletId, PartnerAsset, Asset, AssetService,
} from '../global'
import { Transaction as EthereumTransaction, Log as EthereumLog } from 'web3/node_modules/web3-core'

export class EthereumTransactionsGetter {
  constructor(private block: number) {}

  async get() {
    const { transactions: ethereumTransactions } = await web3.eth.getBlock(this.block, true)
    const logs = await web3.eth.getPastLogs({ fromBlock: this.block, toBlock: this.block })
    const results = []
    for (const ethereumTransaction of ethereumTransactions) {
      results.push(await this.parseEthereumTransaction(ethereumTransaction))
    }
    for (const log of logs) {
      results.push(await this.parseEthereumLog(log))
    }
    return compact(results)
  }

  private async parseEthereumTransaction(transaction: EthereumTransaction): Promise<Partial<ITransaction> | null> {
    if (transaction.value === '0') return null
    const shouldParse = await WalletService.isAddressExisted(transaction.to)
    if (!shouldParse) return null

    const wallet = await Wallet.findOne({ address: toLower(transaction.to) })
    const partnerWallet = await PartnerAsset.findOne({
      assetId: EDefaultWalletId.ETH,
      partnerId: wallet.partnerId,
    })
    if (isNil(partnerWallet)) return null

    const asset = await Asset.findById(EDefaultWalletId.ETH)
    return {
      hash: transaction.hash,
      assetId: EDefaultWalletId.ETH,
      partnerId: wallet.partnerId,
      block: transaction.blockNumber,
      value: new BigNumber(transaction.value).div(Math.pow(10, asset.decimals)).toNumber(),
    }
  }

  private async parseEthereumLog(log: EthereumLog): Promise<Partial<ITransaction> | null> {
    const isTransferLog = log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    if (!isTransferLog) return null
    if (!await AssetService.isAssetExisted(log.address)) return null

    const toAddress = `0x${log.topics[2].substring(26)}`
    if (!await WalletService.isAddressExisted(toAddress)) return null
    const wallet = await Wallet.findOne({ address: toAddress })
    const asset = await Asset.findOne({ address: log.address })
    const partnerWallet = await PartnerAsset.findOne({
      assetId: asset.assetId,
      partnerId: wallet.partnerId,
    })
    if (isNil(partnerWallet)) return null

    return {
      hash: log.transactionHash,
      assetId: asset.assetId,
      partnerId: wallet.partnerId,
      block: log.blockNumber,
      value: new BigNumber(log.data).div(Math.pow(10, asset.decimals)).toNumber(),
    }
  }
}
