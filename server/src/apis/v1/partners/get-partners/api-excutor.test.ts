import { deepStrictEqual } from 'assert'
import { TestUtils, Partner, deepOmit } from '../../../../global'
import { ApiExcutor } from './api-excuter'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(async () => {
    await Partner.createMany([
      { partnerId: 1, name: 'Testing Partner 1', isAdmin: true },
      { partnerId: 2, name: 'Testing Partner 2' },
    ])
  })

  it(`${TEST_TITLE} ApiExcutor works with not-followed users`, async () => {
    const response = await new ApiExcutor().excute()
    deepStrictEqual(
      deepOmit(response, ['created', 'modified', 'bitcoinWallet', 'ethereumWallet']),
      [
        {
          partnerId: 1,
          isAdmin: true,
          name: 'Testing Partner 1',
          status: 'ENABLED',
        },
        {
          partnerId: 2,
          isAdmin: false,
          name: 'Testing Partner 2',
          status: 'ENABLED',
        },
      ]
    )
  })
})
