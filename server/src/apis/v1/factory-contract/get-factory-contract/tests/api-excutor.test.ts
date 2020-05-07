import { deepEqual } from 'assert'
import {
  TestUtils, Partner, deepOmit, IPartnerContext,
  TestPartnerContextBuilder, FactoryContract,
} from '../../../../../global'
import { ApiExcutor } from '../service'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  let partnerContext: IPartnerContext
  beforeEach(async () => {
    partnerContext = await TestPartnerContextBuilder.create({ partnerId: 1, name: 'Testing account 1' })
    await Partner.create({ partnerId: 2 })

    await FactoryContract.createMany([
      { factoryContractId: 1, partnerId: 1 },
      { factoryContractId: 2, partnerId: 1 },
      // dont show because wrong partnerId
      { factoryContractId: 3, partnerId: 2 },
    ])
  })

  it(`${TEST_TITLE} ApiExcutor works`, async () => {
    const response = await new ApiExcutor().excute(null, partnerContext)
    deepEqual(
      deepOmit(response, ['created', 'modified', 'address', 'status', 'infuraKey', 'network']),
      [
        { factoryContractId: 1, partnerId: 1 },
        { factoryContractId: 2, partnerId: 1 },
      ]
    )
  })
})
