// import td from 'testdouble'
// import { TestUtils, Partner, FactoryContract, DepositContract, Transaction } from '../../global'
// import { TransactionScanner } from '../transaction-scanner'
// import { EthereumFactoryContract } from '../ethereum-factory-contract'
// import { TransactionGetter } from '../transaction-getter'

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
//     const transactionScanner = new TransactionScanner([ethereumFactoryContract])

//     const fakeDeposits = [
//       {
//         address: '0xe76d0caa64ec7ebd5d0c531119ada6986adb3c61',
//         block: 10018668,
//         value: 10,
//         transactionHash: '0x58e511d7afc439db65233f9033c7abacd59ea09759ec9663676779b4d26d0024',
//         coinAddress: '0x5c4e325d2c570443f4ea3ed5623c58de221e9475',
//         created: new Date(0),
//       },
//     ]
//     td.replace(TransactionGetter, 'get', () => fakeDeposits)
//     td.replace(DepositContract, 'findOne', td.function())
//     td.when(DepositContract.findOne({ address: fakeDeposits[0].address })).thenResolve({ depositContractId: 1 })
//     td.replace(Transaction, 'create', td.function())

//     await transactionScanner.process()

//     td.verify(Transaction.create({
//       depositContractId: 1,
//       block: 10018668,
//       value: 10,
//       hash: '0x58e511d7afc439db65233f9033c7abacd59ea09759ec9663676779b4d26d0024',
//       coinAddress: '0x5c4e325d2c570443f4ea3ed5623c58de221e9475',
//       created: new Date(0),
//     }))
//   })
// })
