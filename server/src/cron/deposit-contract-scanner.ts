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
      const depositContracts = await DepositContractGetter.get(this.ethereumFactoryContracts[index])
      await DepositContract.createMany(depositContracts)
    }
  }
}
