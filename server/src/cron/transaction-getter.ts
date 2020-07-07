//   import { map } from 'lodash'
// import { EthereumFactoryContract } from './ethereum-factory-contract'
// import { EventLog as EthereumEventLog } from 'web3/node_modules/web3-core/types'
// import { Transaction } from '../global'

// export interface IEthereumDeposit {
//   address: string
//   transactionHash: string
//   value: number
//   block: number
//   coinAddress: string
//   created: Date
// }

// export class TransactionGetter {
//   constructor(private ethereumFactoryContract: EthereumFactoryContract) {}

//   public static async get(ethereumFactoryContract: EthereumFactoryContract) {
//     return new TransactionGetter(ethereumFactoryContract).get()
//   }

//   public async get() {
//     const lastScannedBlock = await this.getLastScannedBlock()
//     const logs = await this.getEthereumLogsByBlock(lastScannedBlock)
//     const result: IEthereumDeposit[] = []
//     for (let index = 0; index < logs.length; index++) {
//       result.push(await this.parseLog(logs[index]))
//     }
//     return result
//   }

//   getLastScannedBlock() {
//    return Transaction.max('transaction.block', builder => {
//       return builder
//         .where('depositContract.factoryContractId', '=', this.ethereumFactoryContract.factoryContract.factoryContractId)
//         .innerJoin('depositContract', 'depositContract.depositContractId', 'transaction.depositContractId')
//     })
//   }

//   private getEthereumLogsByBlock(lastScannedBlock: number): Promise<EthereumEventLog[]> {
//     const EVENT_NAME = 'Deposit'
//     return this.ethereumFactoryContract.getEthereumLogs(lastScannedBlock + 1, EVENT_NAME)
//   }

//   private async parseLog(log: EthereumEventLog): Promise<IEthereumDeposit> {
//     // tslint:disable-next-line: no-any
//     const { returnValues: { bank: address, value, coinAddress } } = log as any
//     const ONE_ETHER = 1e18
//     return {
//       address: address.toString().toLowerCase(),
//       block: log.blockNumber,
//       value: value / ONE_ETHER,
//       transactionHash: log.transactionHash,
//       coinAddress: coinAddress.toLowerCase(),
//       created: await this.getBlockTime(log.blockNumber),
//     }
//   }

//   private async getBlockTime(blockNumber: number) {
//     const block = await this.ethereumFactoryContract.web3.eth.getBlock(blockNumber)
//     return new Date(Number(block.timestamp) * 1000)
//   }
// }
