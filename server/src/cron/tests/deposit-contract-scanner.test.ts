// import td from 'testdouble'
// import { TestUtils, Partner, FactoryContract, DepositContract } from '../../global'
// import { DepositContractScanner } from '../deposit-contract-scanner'
// import { EthereumFactoryContract } from '../ethereum-factory-contract'
// import { DepositContractGetter } from '../deposit-contract-getter'

// const TEST_TITLE = TestUtils.getTestTitle(__filename)

// describe(TEST_TITLE, () => {
//   beforeEach(TEST_TITLE, async () => {
//     await Partner.create({ partnerId: 1 })

//     await FactoryContract.createMany([
//       { factoryContractId: 1, partnerId: 1 },
//       { factoryContractId: 2, partnerId: 1 },
//     ])
//   })

//   it(`${TEST_TITLE} #process`, async () => {
//     const ethereumFactoryContract: EthereumFactoryContract = null
//     const depositContractScanner = new DepositContractScanner([ethereumFactoryContract])

//     const fakeDepositContracts = [
//       { address: '0xe5c5427ce3caa2420a0c2bda4eec76619dc0e251', block: 9831014, factoryContractId: 1 },
//       { address: '0x506b95fca4fc5018650e432199d30f047d26794e', block: 9831014, factoryContractId: 1 },
//     ]
//     td.replace(DepositContractGetter, 'get', () => fakeDepositContracts)
//     td.replace(DepositContract, 'createMany', td.function())
//     await depositContractScanner.process()

//     td.verify(DepositContract.createMany(fakeDepositContracts))
//   })
// })
