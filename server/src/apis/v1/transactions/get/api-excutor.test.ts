import { deepStrictEqual, strictEqual } from 'assert'
import { map } from 'lodash'
import { TestUtils, Partner, Transaction, Value, Asset, Wallet } from '../../../../global'
import { ApiExcutor } from './api-excutor'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(async () => {
    await Partner.createMany([
      { partnerId: 1 },
      { partnerId: 2 },
    ])

    await Wallet.create({ walletId: 1, partnerId: 1, address:  '0x0' })

    await Asset.createMany([
      {
        assetId: 11,
        address: '_asset_address_1',
        name: 'AS1',
      },
      {
        assetId: 12,
        address: '_asset_address_2',
        name: 'AS2',
      },
      {
        assetId: 13,
        address: '_asset_address_3',
        name: 'AS3',
      },
    ])

    await Transaction.createMany([
      { transactionId: 1, partnerId: 1, assetId: 11, walletId: 1 },
      { transactionId: 2, partnerId: 1, assetId: 12, walletId: 1 },
      { transactionId: 3, partnerId: 1, assetId: 11, walletId: 1 },
      { transactionId: 4, partnerId: 2, assetId: 13, walletId: 1 },
    ])
  })

  it(`${TEST_TITLE} ApiExcutor works with asset id`, async () => {
    const response = await new ApiExcutor()
      .excute(
        { fromTransactionId: 0, limit: 2, page: 1 },
        Value.wrap({ partner: { partnerId: 1 } })
      )

    strictEqual(response.total, 3)
    deepStrictEqual(map(response.transactions, 'transactionId'), [1, 2])
  })

  it(`${TEST_TITLE} ApiExcutor works with assetId`, async () => {
    const response = await new ApiExcutor()
      .excute(
        { fromTransactionId: 0, limit: 2, page: 1, assetId: 11 },
        Value.wrap({ partner: { partnerId: 1 } })
      )

    strictEqual(response.total, 2)
    deepStrictEqual(map(response.transactions, 'transactionId'), [1, 3])
  })
})
