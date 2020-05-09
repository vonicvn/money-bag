import { deepEqual } from 'assert'
import {
  TestUtils, Partner, deepOmit, IPartnerContext,
  TestPartnerContextBuilder, FactoryContract, DepositContract,
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
    ])

    await DepositContract.createMany([
      { depositContractId: 1, factoryContractId: 1, address: '0x1' },
      { depositContractId: 2, factoryContractId: 1, address: '0x2' },
      { depositContractId: 3, factoryContractId: 2, address: '0x3' },
    ])
  })

  it(`${TEST_TITLE} ApiExcutor works`, async () => {
    const response = await new ApiExcutor()
      .excute({ factoryContractId: 1, fromDepositContractId: 1 }, partnerContext)

    deepEqual(
      deepOmit(response, ['created', 'modified', 'block']),
      [
        {
          depositContractId: 1,
          factoryContractId: 1,
          address: '0x1',
        },
        {
          depositContractId: 2,
          factoryContractId: 1,
          address: '0x2',
        },
      ]
    )
  })
})
