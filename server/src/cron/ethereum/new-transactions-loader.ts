import { isNil } from 'lodash'
import {
  Redis,
  ITransaction,
  Transaction,
  Web3InstanceManager,
  Env,
  EEnvKey,
  EEnviroment
} from '../../global'
import {
  TransactionsGetter,
} from './transactions-getter'

export class NewTransactionsLoader {
  async load() {
    const { from, to } = await this.getRange()
    for (let block = from; block <= to; block++) {
      const transactions = await this.scanBlock(block)
      await Transaction.createMany(transactions)
      await Redis.setJson<number>('ETHEREUM_SCANNED_BLOCK', block)
    }
  }

  private async getRange() {
    const currentBlock = await Web3InstanceManager.defaultWeb3.eth.getBlockNumber()
    const defaultRange = {
      from: currentBlock - Env.SAFE_NUMBER_OF_COMFIRMATION,
      to: currentBlock - Env.SAFE_NUMBER_OF_COMFIRMATION,
    }

    const scanned = await Redis.getJson<number>('ETHEREUM_SCANNED_BLOCK')
    if (isNil(scanned)) return defaultRange

    const BIG_MISS_BLOCK = 20
    const shouldSkipBlocks = (
      Env.get(EEnvKey.NODE_ENV) !== EEnviroment.PRODUCTION &&
      currentBlock - scanned > BIG_MISS_BLOCK
    )
    if (shouldSkipBlocks) return defaultRange

    return {
      from: scanned + 1,
      to: currentBlock - Env.SAFE_NUMBER_OF_COMFIRMATION,
    }
  }

  private async scanBlock(block: number): Promise<Partial<ITransaction>[]> {
    console.log(`[ETHEREUM SCAN BLOCK] ${block}`)
    return new TransactionsGetter(block).get()
  }
}
