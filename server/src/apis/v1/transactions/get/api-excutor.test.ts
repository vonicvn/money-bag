import { deepEqual, equal } from 'assert'
import { map } from 'lodash'
import { TestUtils, Partner, Transaction, Value, Asset } from '../../../../global'
import { ApiExcutor } from './api-excutor'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(async () => {
    await Partner.createMany([
      { partnerId: 1 },
      { partnerId: 2 },
    ])

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
      { transactionId: 1, partnerId: 1, assetId: 11 },
      { transactionId: 2, partnerId: 1, assetId: 12 },
      { transactionId: 3, partnerId: 1, assetId: 11 },
      { transactionId: 4, partnerId: 2, assetId: 13 },
    ])
  })

  it(`${TEST_TITLE} ApiExcutor works with asset id`, async () => {
    const response = await new ApiExcutor()
      .excute(
        { fromTransactionId: 0, limit: 2, page: 1 },
        Value.wrap({ partner: { partnerId: 1 } })
      )

    equal(response.total, 3)
    deepEqual(map(response.transactions, 'transactionId'), [1, 2])
  })

  it(`${TEST_TITLE} ApiExcutor works with assetId`, async () => {
    const response = await new ApiExcutor()
      .excute(
        { fromTransactionId: 0, limit: 2, page: 1, assetId: 11 },
        Value.wrap({ partner: { partnerId: 1 } })
      )

    equal(response.total, 2)
    deepEqual(map(response.transactions, 'transactionId'), [1, 3])
  })
})
