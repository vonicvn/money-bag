import td from 'testdouble'
import { equal, ok, deepEqual } from 'assert'
import { TestUtils, Value, ErrorHandler, Wallet, Redis, web3 } from '../global'
import { EthereumTransactionsGetter } from './ethereum-transactions-getter'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it.only('#get', async () => {
    // td.replace(web3.eth, 'getBlock', () => ({ transactions: ['transaction1', 'transaction2'] }))

    // td.replace(EthereumTransactionsGetter.prototype, 'parseOneTransaction')
    // td
    //   .when(EthereumTransactionsGetter.prototype['parseOneTransaction'](Value.wrap('transaction1')))
    //   .thenResolve({ hash: '0x1' })

    // td
    //   .when(EthereumTransactionsGetter.prototype['parseOneTransaction'](Value.wrap('transaction2')))
    //   .thenResolve(null)

    // deepEqual(
    //   await EthereumTransactionsGetter.prototype.get(),
    //   [{ hash: '0x1' }]
    // )
    console.log(await web3.eth.getBlock(10425131, true))
  })
})
