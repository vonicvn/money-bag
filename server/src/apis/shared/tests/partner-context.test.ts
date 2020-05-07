import { TestUtils, TestPartnerContextBuilder } from '../../../global'
import { deepEqual } from 'assert'
import { PartnerContextManager } from '../partner-context'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} PartnerContextManager works with valid token`, async () => {
    const SAMPLE_API_KEY = 'SAMPLE_API_KEY'
    const originalPartnerContext = await TestPartnerContextBuilder.create({ apiKey: SAMPLE_API_KEY })
    const partnerContext = await PartnerContextManager.getPartnerContext({ headers: { 'X-API-KEY': SAMPLE_API_KEY } })
    deepEqual(originalPartnerContext, partnerContext)
  })

  it(`${TEST_TITLE} PartnerContextManager works with invalid token`, async () => {
    const partnerContext = await PartnerContextManager.getPartnerContext({ headers: { 'X-API-KEY': `NON_EXISTS_API_KEY` } })
    deepEqual(partnerContext, { partner: null })
  })

  it(`${TEST_TITLE} PartnerContextManager works with no token`, async () => {
    const partnerContext = await PartnerContextManager.getPartnerContext({ headers: {} })
    deepEqual(partnerContext, { partner: null })
  })
})
