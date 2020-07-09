import { compact, toLower } from 'lodash'
import { ITransaction, web3, WalletService, Wallet } from '../global'
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
    return {
      hash: transaction.hash,
      assetId: 0,
      partnerId: wallet.partnerId,
    }
  }

  private async parseEthereumLog(log: EthereumLog): Promise<Partial<ITransaction> | null> {
    return null
  }
}
