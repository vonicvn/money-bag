import {
  compact,
  toLower,
} from 'lodash'
import {
  Transaction as EthereumTransaction,
  Log as EthereumLog,
} from 'web3/node_modules/web3-core'
import {
  Web3InstanceManager,
  Fetch,
  Env,
  EEnvKey,
  EBlockchainNetwork,
  ITransactionInput,
} from '../../../global'

export class TransactionsGetter {
  constructor(private block: number) {}

  async get(): Promise<ITransactionInput[]> {
    const results = []
    const ethereumTransactions = await this.getBlock()
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

  private async parseEthereumTransaction(transaction: EthereumTransaction): Promise<ITransactionInput | null> {
    if (transaction.value === '0') return null
    return {
      hash: transaction.hash,
      toAddress: toLower(transaction.to),
      block: Number(transaction.blockNumber),
      value: transaction.value,
      assetAddress: null,
      network: EBlockchainNetwork.ETHEREUM,
    }
  }

  private async parseEthereumLog(log: EthereumLog): Promise<ITransactionInput | null> {
    const isTransferLog = log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    if (!isTransferLog) return null

    const toAddress = `0x${log.topics[2].substring(26)}`
    return {
      hash: log.transactionHash,
      block: Number(log.blockNumber),
      value: log.data,
      assetAddress: log.address,
      toAddress,
      network: EBlockchainNetwork.ETHEREUM,
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
