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
  beforeEach(async () => {
    await Partner.create({ partnerId: 1 })
    await Withdrawal.create({
      withdrawalId: 1,
      partnerId: 1,
      assetId: 1,
    })
  })

  it('Works', async () => {
    await new InputValidator()
      .validate(
        { withdrawalId: 1 },
        Value.wrap({ partner: { partnerId: 1 } })
      )
  })

  it('Not found case', async () => {
    const error = await new InputValidator()
      .validate(
        { withdrawalId: 100 },
        Value.wrap({ partner: { partnerId: 1 } })
      )
      .catch(error => error)

    strictEqual(error.code, EErrorCode.WITHDRAWAL_NOT_FOUND)
  })

  it('Wrong partnerId case', async () => {
    const error = await new InputValidator()
      .validate(
        { withdrawalId: 1 },
        Value.wrap({ partner: { partnerId: 2 } })
      )
      .catch(error => error)

    strictEqual(error.code, EErrorCode.WITHDRAWAL_NOT_FOUND)
  })
})
