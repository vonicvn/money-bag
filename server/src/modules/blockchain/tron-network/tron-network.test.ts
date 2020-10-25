import td from 'testdouble'
import {
  strictEqual,
} from 'assert'
import {
  TestUtils,
} from '../../../global'
import { TronNetwork } from '.'
import { TronWebInstance } from './tron-web-instance'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  const tronNetwork = new TronNetwork()

  it('#getBlockNumber', async () => {
    td.replace(TronWebInstance.default.trx, 'getCurrentBlock', () => ({
      block_header: { raw_data: { number: 100 } },
    }))
    strictEqual(
      await tronNetwork.getBlockNumber(),
      100
    )
  })

  it('#getTransactionInputs', async () => {
    const response = await tronNetwork.getTransactionInputs(8949006)
    console.log(response)
  })
})
