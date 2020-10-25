import td from 'testdouble'
import {
  TestUtils,
  Value,
  BlockchainModule,
  EBlockchainNetwork,
} from '../../../../../global'
import { ApiExcutor } from './api-excutor'
import { NewTransactionsLoader } from '../../../../../cron/ethereum/new-transactions-loader'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(async () => {
    td.replace(
      BlockchainModule,
      'get',
      () => ({ getTransactionInputs: () => Value.SOME_OBJECT })
    )
  })

  it(`${TEST_TITLE} ApiExcutor works`, async () => {
    td.replace(NewTransactionsLoader.prototype, 'scan')
    await new ApiExcutor()
      .excute(
        { blockNumber: 2, network: EBlockchainNetwork.TRON },
        Value.NO_MATTER
      )

    td.verify(NewTransactionsLoader.prototype.scan(2))
  })
})
