import td from 'testdouble'
import {
  deepStrictEqual, ok, strictEqual,
} from 'assert'
import {
  TestUtils,
} from '../../../global'
import { TronNetwork } from '.'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(`${TEST_TITLE} #getRange`, () => {
  const tronNetwork = new TronNetwork()

  it('getBlockNumber', async () => {
    td.replace(TronNetwork.tronWeb.trx, 'getCurrentBlock', () => ({
      block_header: { raw_data: { number: 100 } },
    }))
    strictEqual(
      await tronNetwork.getBlockNumber(),
      100
    )
  })
})
