import td from 'testdouble'
import { TestUtils, Partner, FactoryContract, DepositContract } from '../../global'
import { equal, deepEqual } from 'assert'
import { DepositContractGetter } from '../deposit-contract-getter'
import { EthereumFactoryContract } from '../ethereum-factory-contract'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(TEST_TITLE, async () => {
    await Partner.create({ partnerId: 1 })

    await FactoryContract.createMany([
      { factoryContractId: 1, partnerId: 1 },
      { factoryContractId: 2, partnerId: 1 },
    ])
  })

  it(`${TEST_TITLE} #getLastScannedBlock`, async () => {
    await DepositContract.createMany([
      { depositContractId: 1, factoryContractId: 1, address: '0x1', block: 1 },
      { depositContractId: 2, factoryContractId: 1, address: '0x2', block: 2 },
      // do not count this deposit contract because factoryContractId is difference
      { depositContractId: 3, factoryContractId: 2, address: '0x3', block: 3 },
    ])
    const depositContractGetter = new DepositContractGetter(null)
    td.replace(depositContractGetter, 'ethereumFactoryContract', { factoryContract: { factoryContractId: 1 } })

    const lastScannedBlock = await depositContractGetter.getLastScannedBlock()
    equal(lastScannedBlock, 2)
  })

  it(`${TEST_TITLE} #get`, async () => {
    const ethereumFactoryContract = new EthereumFactoryContract(await FactoryContract.findById(1))
    const depositContractGetter = new DepositContractGetter(ethereumFactoryContract)

    const mockLogs = [
      {
        blockNumber: 9831014,
        returnValues: {
          '0': '0xe5c5427CE3Caa2420a0c2bda4EEC76619dc0E251',
          bank: '0xe5c5427CE3Caa2420a0c2bda4EEC76619dc0E251',
        },
        event: 'CreateBanker',
      },
      {
        blockNumber: 9831014,
        returnValues: {
          '0': '0x506B95FCA4FC5018650e432199d30f047d26794e',
          bank: '0x506B95FCA4FC5018650e432199d30f047d26794e',
        },
        event: 'CreateBanker',
      },
    ]
    td.replace(ethereumFactoryContract.ethereumContract, 'getPastEvents', () => Promise.resolve(mockLogs))
    deepEqual(
      await depositContractGetter.get(),
      [
        { address: '0xe5c5427ce3caa2420a0c2bda4eec76619dc0e251', block: 9831014 },
        { address: '0x506b95fca4fc5018650e432199d30f047d26794e', block: 9831014 },
      ]
    )
  })
})
