import { deepEqual, equal } from 'assert'
import { map } from 'lodash'
import { TestUtils, Partner, Transaction, Value, Token } from '../../../../global'
import { ApiExcutor } from './api-excutor'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(async () => {
    await Partner.createMany([
      { partnerId: 1 },
      { partnerId: 2 },
    ])

    await Token.createMany([
      {
        tokenId: 1,
        partnerId: 1,
        address: '_token_address_1',
      },
      {
        tokenId: 2,
        partnerId: 1,
        address: '_token_address_2',
      },
      {
        tokenId: 3,
        partnerId: 2,
        address: '_token_address_3',
      },
    ])

    await Transaction.createMany([
      { transactionId: 1, partnerId: 1, tokenId: 1 },
      { transactionId: 2, partnerId: 1, tokenId: 2 },
      { transactionId: 3, partnerId: 1, tokenId: 1 },
      { transactionId: 4, partnerId: 2, tokenId: 3 },
    ])
  })

  it(`${TEST_TITLE} ApiExcutor works with token id`, async () => {
    const response = await new ApiExcutor()
      .excute(
        { fromTransactionId: 0, limit: 2, page: 1 },
        Value.wrap({ partner: { partnerId: 1 } })
      )

    equal(response.total, 3)
    deepEqual(map(response.transactions, 'transactionId'), [1, 2])
  })

  it(`${TEST_TITLE} ApiExcutor works with tokenId`, async () => {
    const response = await new ApiExcutor()
      .excute(
        { fromTransactionId: 0, limit: 2, page: 1, tokenId: 1 },
        Value.wrap({ partner: { partnerId: 1 } })
      )

    equal(response.total, 2)
    deepEqual(map(response.transactions, 'transactionId'), [1, 3])
  })
})
