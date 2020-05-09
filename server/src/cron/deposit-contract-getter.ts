import { map } from 'lodash'
import { EthereumFactoryContract } from './ethereum-factory-contract'
import { EventLog as EthereumEventLog } from 'web3/node_modules/web3-core/types'
import { DepositContract } from '../global'

export class DepositContractGetter {
  constructor(private ethereumFactoryContract: EthereumFactoryContract) {}

  public static async get(ethereumFactoryContract: EthereumFactoryContract) {
    return new DepositContractGetter(ethereumFactoryContract).get()
  }

  public async get() {
    const lastScannedBlock = await this.getLastScannedBlock()
    const logs = await this.getEthereumLogsByBlock(lastScannedBlock)
    return map(logs, this.parseLog.bind(this))
  }

  getLastScannedBlock() {
    return DepositContract.max('block', builder => {
      const { factoryContractId } = this.ethereumFactoryContract.factoryContract
      return builder.where({ factoryContractId })
    })
  }

  private getEthereumLogsByBlock(lastScannedBlock: number): Promise<EthereumEventLog[]> {
    const EVENT_NAME = 'CreateBanker'
    return this.ethereumFactoryContract.getEthereumLogs(lastScannedBlock + 1, EVENT_NAME)
  }

  private parseLog(log: EthereumEventLog): { address: string, block: number, factoryContractId: number } {
    // tslint:disable-next-line: no-any
    const { returnValues: { bank: address } } = log as any
    return {
      address: address.toString().toLowerCase(),
      block: log.blockNumber,
      factoryContractId: this.ethereumFactoryContract.factoryContract.factoryContractId,
    }
  }
}
