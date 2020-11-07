import { strictEqual } from 'assert'
import {
  TestUtils,
  Value,
  Withdrawal,
  Partner,
} from '../../../../global'
import { EErrorCode } from './metadata'
import { InputValidator } from './input-validator'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it('Works', async () => {
    await new InputValidator().validate(
      { requestId: 1, assetId: 1, value: 1 },
      Value.wrap({ partner: { partnerId: 1 } })
    )
  })

  it('Prevent duplicated', async () => {
    await Partner.create({ partnerId: 1 })
    await Withdrawal.create({ requestId: 1, assetId: 1, value: 1, partnerId: 1 })

    const error = await new InputValidator()
      .validate(
        { requestId: 1, assetId: 1, value: 1 },
        Value.wrap({ partner: { partnerId: 1 } })
      )
      .catch(error => error)

    strictEqual(error.code, EErrorCode.DUPLICATE_REQUEST_ID)
  })

  it('Prevent invalid assetId', async () => {
    await Partner.create({ partnerId: 1 })

    const error = await new InputValidator()
      .validate(
        { requestId: 1, assetId: 10000000, value: 1 },
        Value.wrap({ partner: { partnerId: 1 } })
      )
      .catch(error => error)

    strictEqual(error.code, EErrorCode.ASSET_NOT_FOUND)
  })
})
