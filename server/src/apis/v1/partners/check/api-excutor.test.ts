import { deepStrictEqual } from 'assert'
import { TestUtils, Partner, deepOmit, Value } from '../../../../global'
import { ApiExcutor } from './api-excuter'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(async () => {
    await Partner.create({ partnerId: 1, name: 'Testing Partner 1', isAdmin: true })
  })

  it(`${TEST_TITLE} ApiExcutor works with not-followed users`, async () => {
    const response = await new ApiExcutor()
      .excute(null, Value.wrap({ partner: { partnerId: 1 } }))

    deepStrictEqual(
      deepOmit(response, ['created', 'modified', 'bitcoinWallet', 'ethereumWallet']),
      {
        partnerId: 1,
        isAdmin: true,
        name: 'Testing Partner 1',
        status: 'ENABLED',
      }
    )
  })
})
