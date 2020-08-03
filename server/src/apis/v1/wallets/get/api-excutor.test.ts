import { deepEqual, equal } from 'assert'
import { map } from 'lodash'
import { TestUtils, Partner, Wallet, Value } from '../../../../global'
import { ApiExcutor } from './api-excutor'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(async () => {
    await Partner.createMany([
      { partnerId: 1 },
      { partnerId: 2 },
    ])

    await Wallet.createMany([
      { walletId: 1, partnerId: 1 },
      { walletId: 2, partnerId: 1 },
      { walletId: 3, partnerId: 1 },
      { walletId: 4, partnerId: 2 },
    ])
  })

  it(`${TEST_TITLE} ApiExcutor works`, async () => {
    const response = await new ApiExcutor()
      .excute(
        { fromWalletId: 0, limit: 2, page: 1 },
        Value.wrap({ partner: { partnerId: 1 } })
      )

    equal(response.total, 3)
    deepEqual(map(response.wallets, 'walletId'), [1, 2])
  })
})
