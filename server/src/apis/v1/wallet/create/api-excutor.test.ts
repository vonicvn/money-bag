import td from 'testdouble'
import { deepEqual } from 'assert'
import {
  TestUtils, Partner, deepOmit, IPartnerContext,
  TestPartnerContextBuilder,
  Value,
  WalletService,
} from '../../../../global'
import { ApiExcutor } from './api-excutor'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} ApiExcutor works`, async () => {
    td.replace(WalletService.prototype, 'createWallet')
    await new ApiExcutor().excute({ partnerId: 1234, quantity: 4321 }, Value.NO_MATTER)
    td.verify(WalletService.prototype.createWallet(1234, 4321))
  })
})
