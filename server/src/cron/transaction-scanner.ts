import { defaultTo } from 'lodash'
import { Redis, ITransaction, Transaction, web3 } from '../global'
import { OneAtMomemnt } from './one-at-moment'

// 1. Scan ethereum transaction
// 2. New transactions -> create new jobs
// 3. Scan in_progress jobs -> create new jobs
// 4. Assign jobs to admin accounts
// 5. Process all assigned jobs

export abstract class EthereumScanner extends OneAtMomemnt {
  static SAFE_NUMBER_OF_COMFIRMATION = 0

  private currentBlock: number
  private scannedBlock: number

  protected async do() {
    await this.init()

    for (
      let block = this.scannedBlock + 1;
      block <= this.currentBlock - EthereumScanner.SAFE_NUMBER_OF_COMFIRMATION;
      block++
    ) {
      const transactions = await this.scanBlock(block)
      await Transaction.createMany(transactions)
      await Redis.setJson<number>('ETHEREUM_SCANNED_BLOCK', block)
    }
  }

  private async init() {
    this.currentBlock = await web3.eth.getBlockNumber()
    const scannedBlock = await Redis.getJson<number>('ETHEREUM_SCANNED_BLOCK')
    this.scannedBlock = defaultTo(scannedBlock, this.currentBlock - EthereumScanner.SAFE_NUMBER_OF_COMFIRMATION - 1)
  }

  private async scanBlock(block: number): Promise<Partial<ITransaction>[]> {
    return []
  }
}
