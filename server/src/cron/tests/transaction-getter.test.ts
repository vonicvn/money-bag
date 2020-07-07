// import td from 'testdouble'
// import { TestUtils, Partner, FactoryContract, DepositContract, Transaction } from '../../global'
// import { equal, deepEqual } from 'assert'
// import { EthereumFactoryContract } from '../ethereum-factory-contract'
// import { TransactionGetter } from '../transaction-getter'

// const TEST_TITLE = TestUtils.getTestTitle(__filename)

// describe(TEST_TITLE, () => {
//   beforeEach(TEST_TITLE, async () => {
//     await Partner.create({ partnerId: 1 })

//     await FactoryContract.createMany([
//       { factoryContractId: 1, partnerId: 1, address: '0x3ec6855cee60f9a1fa71648401d1edac825724ba', infuraKey: '62adeea45717464fb7410e5e757d3bc8', network: 'RINKEBY' },
//       { factoryContractId: 2, partnerId: 1 },
//     ])
//   })

//   it(`${TEST_TITLE} #getLastScannedBlock`, async () => {
//     await DepositContract.createMany([
//       { depositContractId: 1, factoryContractId: 1, address: '0x1', block: 1 },
//       { depositContractId: 2, factoryContractId: 1, address: '0x2', block: 2 },
//       // do not count this deposit contract because factoryContractId is difference
//       { depositContractId: 3, factoryContractId: 2, address: '0x3', block: 3 },
//     ])

//     await Transaction.createMany([
//       { transactionId: 1, depositContractId: 1, hash: '0x1', block: 1 },
//       { transactionId: 2, depositContractId: 2, hash: '0x2', block: 2 },
//       { transactionId: 3, depositContractId: 2, hash: '0x3', block: 3 },
//       { transactionId: 4, depositContractId: 3, hash: '0x4', block: 4 },
//     ])
//     const depositContractGetter = new TransactionGetter(null)
//     td.replace(depositContractGetter, 'ethereumFactoryContract', { factoryContract: { factoryContractId: 1 } })

//     const lastScannedBlock = await depositContractGetter.getLastScannedBlock()
//     equal(lastScannedBlock, 3)
//   })

//   it(`${TEST_TITLE} #get`, async () => {
//     const ethereumFactoryContract = new EthereumFactoryContract(await FactoryContract.findById(1))
//     const transactionGetter = new TransactionGetter(ethereumFactoryContract)

//     const mockLogs = [
//       {
//         blockNumber: 10018668,
//         transactionHash: '0x58e511d7afc439db65233f9033c7abacd59ea09759ec9663676779b4d26d0024',
//         returnValues: {
//           bank: '0xE76D0CAa64eC7eBd5D0C531119Ada6986Adb3c61',
//           value: '100000000000000000000',
//           coinAddress: '0x5c4E325d2c570443f4ea3Ed5623c58dE221E9475',
//         },
//         event: 'Deposit',
//       },
//       {
//         blockNumber: 10018680,
//         transactionHash: '0x4393f51de913070b02ad37aff58564dd705def200208ff3af6225b464df81425',
//         returnValues: {
//           bank: '0xE76D0CAa64eC7eBd5D0C531119Ada6986Adb3c61',
//           value: '100000000000000000000',
//           coinAddress: '0x5c4E325d2c570443f4ea3Ed5623c58dE221E9475',
//         },
//         event: 'Deposit',
//       },
//     ]
//     td.replace(ethereumFactoryContract.ethereumContract, 'getPastEvents', () => Promise.resolve(mockLogs))
//     td.replace(ethereumFactoryContract.web3.eth, 'getBlock', () => Promise.resolve({ timestamp: 0 }))
//     deepEqual(
//       await transactionGetter.get(),
//       [
//         {
//           address: '0xe76d0caa64ec7ebd5d0c531119ada6986adb3c61',
//           block: 10018668,
//           value: 100,
//           transactionHash: '0x58e511d7afc439db65233f9033c7abacd59ea09759ec9663676779b4d26d0024',
//           coinAddress: '0x5c4e325d2c570443f4ea3ed5623c58de221e9475',
//           created: new Date(0),
//         },
//         {
//           address: '0xe76d0caa64ec7ebd5d0c531119ada6986adb3c61',
//           block: 10018680,
//           value: 100,
//           transactionHash: '0x4393f51de913070b02ad37aff58564dd705def200208ff3af6225b464df81425',
//           coinAddress: '0x5c4e325d2c570443f4ea3ed5623c58de221e9475',
//           created: new Date(0),
//         },
//       ]
//     )
//   })
// })
