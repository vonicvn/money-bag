import { compact } from 'lodash'
import { ITransaction, web3 } from '../global'
import { Transaction as EthereumTransaction } from 'web3/node_modules/web3-core'

export class EthereumTransactionsGetter {
  constructor(private block: number) {}

  async get() {
    const { transactions: ethereumTransactions } = await web3.eth.getBlock(this.block, true)
    const results = []
    for (const ethereumTransaction of ethereumTransactions) {
      results.push(await this.parseOneTransaction(ethereumTransaction))
    }
    return compact(results)
  }

  private async parseOneTransaction(transaction: EthereumTransaction): Promise<Partial<ITransaction> | null> {
    const isEthereumTransfer = transaction.input === '0x0'
    if (isEthereumTransfer) return this.parseEthereumTransfer(transaction)
    return this.parseTokenTransfer(transaction)
  }

  private async parseTokenTransfer(transaction: EthereumTransaction): Promise<Partial<ITransaction> | null> {
    return null
  }

  private async parseEthereumTransfer(transaction: EthereumTransaction): Promise<Partial<ITransaction> | null> {
    return null
  }
}
