  import { map } from 'lodash'
import { EthereumFactoryContract } from './ethereum-factory-contract'
import { EventLog as EthereumEventLog } from 'web3/node_modules/web3-core/types'
import { Transaction } from '../global'

export interface IEthereumDeposit {
  address: string
  transactionHash: string
  value: string
  block: number
  coinAddress: string
}

export class TransactionGetter {
  constructor(private ethereumFactoryContract: EthereumFactoryContract) {}

  public static async get(ethereumFactoryContract: EthereumFactoryContract) {
    return new TransactionGetter(ethereumFactoryContract).get()
  }

  public async get() {
    const lastScannedBlock = await this.getLastScannedBlock()
    const logs = await this.getEthereumLogsByBlock(lastScannedBlock)
    return map(logs, this.parseLog)
  }

  getLastScannedBlock() {
   return Transaction.max('transaction.block', builder => {
      return builder
        .where('depositContract.factoryContractId', '=', this.ethereumFactoryContract.factoryContract.factoryContractId)
        .innerJoin('depositContract', 'depositContract.depositContractId', 'transaction.depositContractId')
    })
  }

  private getEthereumLogsByBlock(lastScannedBlock: number): Promise<EthereumEventLog[]> {
    const EVENT_NAME = 'Deposit'
    return this.ethereumFactoryContract.getEthereumLogs(lastScannedBlock + 1, EVENT_NAME)
  }

  private parseLog(log: EthereumEventLog): IEthereumDeposit {
    // tslint:disable-next-line: no-any
    const { returnValues: { bank: address, value, coinAddress } } = log as any
    return {
      address: address.toString().toLowerCase(),
      block: log.blockNumber,
      value,
      transactionHash: log.transactionHash,
      coinAddress: coinAddress.toLowerCase(),
    }
  }
}
