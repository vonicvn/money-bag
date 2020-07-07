import { TestUtils, Partner, TestPartnerContextBuilder, FactoryContract } from '../../../../global'
import { InputValidator } from './service'
import { IInput, EErrorCode } from './metadata'
import { equal } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  const sampleInput: IInput = {
    factoryContractId: 1,
    fromDepositContractId: 1,
  }

  it(`${TEST_TITLE} Given invalid factoryContractId, it should throw an error`, async () => {
    const error = await new InputValidator()
      .validate({ ...sampleInput, factoryContractId: NaN })
      .catch(error => error)
    equal(error.code, EErrorCode.INVALID_FACTORY_CONTRACT_ID)
  })

  it(`${TEST_TITLE} Given invalid fromDepositContractId, it should throw an error`, async () => {
    const error = await new InputValidator()
      .validate({ ...sampleInput, fromDepositContractId: NaN })
      .catch(error => error)
    equal(error.code, EErrorCode.INVALID_FACTORY_CONTRACT_ID)
  })

  it(`${TEST_TITLE} InputValidator works with valid input`, async () => {
    const partnerContext = await TestPartnerContextBuilder.create({ partnerId: 1 })
    await FactoryContract.create({
      factoryContractId: 1,
      partnerId: partnerContext.partner.partnerId,
    })
    await new InputValidator().validate({
      factoryContractId: 1,
      fromDepositContractId: 1,
    }, partnerContext)
  })

  it(`${TEST_TITLE} InputValidator works with valid input`, async () => {
    await Partner.create({ partnerId: 1, name: 'Testing partner 1' })
    await FactoryContract.create({
      factoryContractId: 1,
      partnerId: 1,
    })

    const partnerContext = await TestPartnerContextBuilder.create({
      partnerId: 2,
      name: 'Testing partner 2',
    })
    const error = await new InputValidator()
      .validate({ factoryContractId: 1, fromDepositContractId: 1 }, partnerContext)
      .catch(error => error)

    equal(error.code, EErrorCode.FACTORY_CONTRACT_NOT_FOUND)
  })
})
