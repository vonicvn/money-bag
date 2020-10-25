import td from 'testdouble'
import {
  TestUtils,
  Value,
  BlockchainModule,
} from '../../../../../global'
import { ApiExcutor } from './api-excutor'

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
    await new ApiExcutor().excute({ blockNumber: 2 }, Value.NO_MATTER)
  })
})
