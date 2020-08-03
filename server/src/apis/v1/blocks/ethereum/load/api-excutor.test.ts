import td from 'testdouble'
import {
  TestUtils,
  Value,
  Transaction,
} from '../../../../../global'
import { ApiExcutor } from './api-excutor'
import { TransactionsGetter } from '../../../../../cron/ethereum/transactions-getter'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(async () => {
    td.replace(TransactionsGetter.prototype, 'get', () => 'new_transactions')
    td.replace(Transaction, 'createMany')
  })

  it(`${TEST_TITLE} ApiExcutor works`, async () => {
    await new ApiExcutor().excute({ blockNumber: 2 }, Value.NO_MATTER)
    td.verify(Transaction.createMany(Value.wrap('new_transactions')))
  })
})
