import td from 'testdouble'
import {
  deepEqual,
} from 'assert'
import {
  TestUtils,
  Value,
  web3,
  Redis,
  Env,
  EEnviroment,
} from '../../global'
import { NewTransactionsLoader } from './new-transactions-loader'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(`${TEST_TITLE} #getRange`, () => {
  it('Return from saved range to current range minus safe confirmations', async () => {
    td.replace(Redis, 'get', () => 100)
    td.replace(web3.eth, 'getBlockNumber', () => 110)
    td.replace(Env, 'SAFE_NUMBER_OF_COMFIRMATION',  5)

    deepEqual(
      await NewTransactionsLoader.prototype['getRange'](),
      { from: 101, to: 105 }
    )
  })

  it('If does not have ETHEREUM_SCANNED_BLOCK, start with one block', async () => {
    td.replace(Redis, 'get', () => Value.wrap(null))
    td.replace(web3.eth, 'getBlockNumber', () => 110)
    td.replace(Env, 'SAFE_NUMBER_OF_COMFIRMATION',  5)

    deepEqual(
      await NewTransactionsLoader.prototype['getRange'](),
      { from: 105, to: 105 }
    )
  })

  it('If not in prod mode, can skip some block if distance is too big', async () => {
    td.replace(Redis, 'get', () => Value.wrap(100))
    td.replace(web3.eth, 'getBlockNumber', () => 1005)
    td.replace(Env, 'SAFE_NUMBER_OF_COMFIRMATION',  5)

    deepEqual(
      await NewTransactionsLoader.prototype['getRange'](),
      { from: 1000, to: 1000 }
    )
  })

  it('Do not skip in prod mode', async () => {
    td.replace(Redis, 'get', () => Value.wrap(100))
    td.replace(web3.eth, 'getBlockNumber', () => 1005)
    td.replace(Env, 'SAFE_NUMBER_OF_COMFIRMATION',  5)
    td.replace(Env, 'get', () => EEnviroment.PRODUCTION)

    deepEqual(
      await NewTransactionsLoader.prototype['getRange'](),
      { from: 101, to: 1000 }
    )
  })
})
