import { map } from 'lodash'
import { DepositContract } from '../global'
import { OneAtMomemnt } from './one-at-moment'
import { EthereumFactoryContract } from './ethereum-factory-contract'
import { DepositContractGetter } from './deposit-contract-getter'

export class DepositContractScanner extends OneAtMomemnt {
  constructor(private ethereumFactoryContracts: EthereumFactoryContract[]) {
    super()
  }

  async do() {
    for (let index = 0; index < this.ethereumFactoryContracts.length; index++) {
      await this.scanForOneContract(this.ethereumFactoryContracts[index])
    }
  }

  async scanForOneContract(ethereumFactoryContract: EthereumFactoryContract) {
    const depositContracts = await DepositContractGetter.get(ethereumFactoryContract)
    const { factoryContractId } = ethereumFactoryContract.factoryContract
    await DepositContract.createMany(map(depositContracts, contract => ({ ...contract, factoryContractId })))
  }
}
