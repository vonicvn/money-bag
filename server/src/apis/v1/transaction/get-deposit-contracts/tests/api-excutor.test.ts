import { deepEqual } from 'assert'
import {
  TestUtils, Partner, deepOmit, IPartnerContext, Transaction,
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

    await Transaction.createMany([
      { transactionId: 1, depositContractId: 1, hash: '0x1', coinAddress: '0xa', created: new Date(0) },
      { transactionId: 2, depositContractId: 1, hash: '0x2', coinAddress: '0xa', created: new Date(0) },
      { transactionId: 3, depositContractId: 2, hash: '0x3', coinAddress: '0xb', created: new Date(0) },
      { transactionId: 4, depositContractId: 3, hash: '0x4', coinAddress: '0xb', created: new Date(0) },
    ])
  })

  it(`${TEST_TITLE} ApiExcutor works`, async () => {
    const response = await new ApiExcutor()
      .excute({ factoryContractId: 1, fromTransactionId: 1 }, partnerContext)

    deepEqual(
      deepOmit(response, ['modified', 'block']),
      [
        { transactionId: 1, depositContractId: 1, value: 0, hash: '0x1', coinAddress: '0xa', created: new Date(0) },
        { transactionId: 2, depositContractId: 1, value: 0, hash: '0x2', coinAddress: '0xa', created: new Date(0) },
        { transactionId: 3, depositContractId: 2, value: 0, hash: '0x3', coinAddress: '0xb', created: new Date(0) },
      ]
    )
  })
})
