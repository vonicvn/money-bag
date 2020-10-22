import BigNumber from 'bignumber.js'
import {
  compact,
  toLower,
  isNil,
} from 'lodash'
import {
  Transaction as EthereumTransaction,
  Log as EthereumLog,
} from 'web3/node_modules/web3-core'
import {
  ITransaction,
  Web3InstanceManager,
  WalletService,
  Wallet,
  EDefaultAssetId,
  PartnerAsset,
  Asset,
  AssetService,
  ECollectingStatus,
  Fetch,
  Env,
  EEnvKey,
  BlockchainJob,
  exists,
} from '../../global'

export class TransactionsGetter {
  constructor(private block: number) {}

  async get() {
    const results = []
    const ethereumTransactions = await this.getBlock()
    console.log(ethereumTransactions)
    for (const ethereumTransaction of ethereumTransactions) {
      results.push(await this.parseEthereumTransaction(ethereumTransaction))
    }

    const logs = await Web3InstanceManager.defaultWeb3.eth.getPastLogs({ fromBlock: this.block, toBlock: this.block })
    for (const log of logs) {
      results.push(await this.parseEthereumLog(log))
    }

    const internalTransactions = await this.getInternalTransactions()
    for (const ethereumTransaction of internalTransactions) {
      results.push(await this.parseEthereumTransaction(ethereumTransaction))
    }

    return compact(results)
  }

  private async parseEthereumTransaction(transaction: EthereumTransaction): Promise<Partial<ITransaction> | null> {
    if (transaction.value === '0') return null
    const shouldParse = await WalletService.isAddressExisted(transaction.to)
    if (!shouldParse) return null

    const wallet = await Wallet.findOne({ address: toLower(transaction.to) })
    if (isNil(wallet)) return

    const partnerWallet = await PartnerAsset.findOne({
      assetId: EDefaultAssetId.ETH,
      partnerId: wallet.partnerId,
    })
    if (isNil(partnerWallet)) return null

    // prevent create transfer all ethereum transaction if it is from admin transfer to wallet to call aprrove ERC token request
    if (exists(await BlockchainJob.findOne({ hash: transaction.hash }))) return

    const asset = await Asset.findById(EDefaultAssetId.ETH)
    return {
      hash: transaction.hash,
      partnerId: wallet.partnerId,
      block: Number(transaction.blockNumber),
      value: new BigNumber(transaction.value).div(Math.pow(10, asset.decimals)).toNumber(),
      collectingStatus: ECollectingStatus.WAITING,
      assetId: EDefaultAssetId.ETH,
      assetName: asset.name,
      walletAddress: wallet.address,
      walletId: wallet.walletId,
    }
  }

  private async parseEthereumLog(log: EthereumLog): Promise<Partial<ITransaction> | null> {
    const isTransferLog = log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    if (!isTransferLog) return null
    if (!await AssetService.isAssetExisted(log.address)) return null

    const toAddress = `0x${log.topics[2].substring(26)}`
    if (!await WalletService.isAddressExisted(toAddress)) return null
    const wallet = await Wallet.findOne({ address: toAddress })
    const asset = await Asset.findOne({ address: log.address.toLowerCase() })

    const partnerWallet = await PartnerAsset.findOne({
      assetId: asset.assetId,
      partnerId: wallet.partnerId,
    })
    if (isNil(partnerWallet)) return null

    return {
      hash: log.transactionHash,
      partnerId: wallet.partnerId,
      block: Number(log.blockNumber),
      value: new BigNumber(log.data).div(Math.pow(10, asset.decimals)).toNumber(),
      collectingStatus: ECollectingStatus.WAITING,
      assetId: asset.assetId,
      assetAddress: asset.address,
      assetName: asset.name,
      walletAddress: wallet.address,
      walletId: wallet.walletId,
    }
  }

  private async getInternalTransactions(): Promise<EthereumTransaction[]> {
    const url = `${Env.get(EEnvKey.ETHERSCAN_API_URL)}` +
      '/api?module=account' +
      `&action=txlistinternal&startblock=${this.block}` +
      `&endblock=${this.block}&sort=asc&apikey=${Env.get(EEnvKey.ETHERSCAN_API_KEY)}`

    const { result: internalTransactions } = await Fetch.get(url, undefined, 5)
    return internalTransactions
  }

  private async getBlock(): Promise<EthereumTransaction[]> {
    const url = `${Env.get(EEnvKey.ETHERSCAN_API_URL)}` +
      '/api?module=proxy' +
      `&action=eth_getBlockByNumber&tag=${this.block.toString(16)}` +
      `&boolean=true&apikey=${Env.get(EEnvKey.ETHERSCAN_API_KEY)}`

    const { result: { transactions } } = await Fetch.get(url, undefined, 5)
    return transactions
  }
}
