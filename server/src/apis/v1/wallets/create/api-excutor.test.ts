import td from 'testdouble'
import {
  EBlockchainNetwork,
  TestUtils,
  Value,
  WalletService,
} from '../../../../global'
import { ApiExcutor } from './api-excutor'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} ApiExcutor works`, async () => {
    td.replace(WalletService.prototype, 'createWallet')
    await new ApiExcutor().excute({ quantity: 4321, network: EBlockchainNetwork.ETHEREUM }, Value.NO_MATTER)
    td.verify(WalletService.prototype.createWallet(4321, EBlockchainNetwork.ETHEREUM))
  })
})
