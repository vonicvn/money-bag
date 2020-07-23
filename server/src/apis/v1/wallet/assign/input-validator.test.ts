import td from 'testdouble'
import {
  TestUtils,
  Value,
  Wallet,
  Partner,
} from '../../../../global'
import { InputValidator } from './input-validator'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it('Pass with valid input', async () => {
    td.replace(Wallet, 'count', () => 10)
    td.replace(Partner, 'findById', () => Value.SOME_OBJECT)
    await new InputValidator().validate(Value.wrap({ quantity: 9 }), Value.NO_MATTER)
  })
})
