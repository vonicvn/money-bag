import { defaultTo } from 'lodash'
import {
  Redis,
  ITransaction,
  Transaction,
  web3,
  Env,
} from '../../global'
import {
  TransactionsGetter,
} from './transactions-getter'

export class NewTransactionsLoader {
  async load() {
    const currentBlock = await web3.eth.getBlockNumber()
    const scannedBlock = defaultTo(
      await Redis.getJson<number>('ETHEREUM_SCANNED_BLOCK'),
      currentBlock - Env.SAFE_NUMBER_OF_COMFIRMATION - 1
    )

    for (
      let block = scannedBlock + 1;
      block <= currentBlock - Env.SAFE_NUMBER_OF_COMFIRMATION;
      block++
    ) {
      const transactions = await this.scanBlock(block)
      await Transaction.createMany(transactions)
      await Redis.setJson<number>('ETHEREUM_SCANNED_BLOCK', block)
    }
  }

  private async scanBlock(block: number): Promise<Partial<ITransaction>[]> {
    console.log(`[ETHEREUM SCAN BLOCK] ${block}`)
    return new TransactionsGetter(block).get()
  }
}
