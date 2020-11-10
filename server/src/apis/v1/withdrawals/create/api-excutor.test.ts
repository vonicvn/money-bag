import { ok } from 'assert'
import {
  Partner,
  TestUtils,
  Value,
} from '../../../../global'
import { ApiExcutor } from './api-excutor'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it('Works', async () => {
    await Partner.create({ partnerId: 1 })
    const input = { requestId: 1, assetId: 1, value: 1, toAddress: '0x0' }
    const context = Value.wrap({ partner: { partnerId: 1 } })
    const response = await new ApiExcutor().excute(input, context)
    ok(response.withdrawalId)
  })
})
