import { isNil } from 'lodash'
import {
  Redis,
  Transaction,
  BlockchainModule,
  Env,
  EEnvKey,
  EEnviroment,
  EBlockchainNetwork
} from '../../global'
import {
  TransactionsGetter,
} from './transactions-getter'

export class NewTransactionsLoader {
  constructor(private network: EBlockchainNetwork) {}

  async load() {
    const { from, to } = await this.getRange()
    for (let block = from; block <= to; block++) {
      const transactions = await new TransactionsGetter(this.network, block).get()
      await Transaction.createMany(transactions)
      await Redis.setJson<number>(`${this.network}_SCANNED_BLOCK`, block)
    }
  }

  private async getRange() {
    const currentBlock = await BlockchainModule.get(this.network).getBlockNumber()
    const defaultRange = {
      from: currentBlock - Env.SAFE_NUMBER_OF_COMFIRMATION,
      to: currentBlock - Env.SAFE_NUMBER_OF_COMFIRMATION,
    }

    const scanned = await Redis.getJson<number>(`${this.network}_SCANNED_BLOCK`)
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
}
