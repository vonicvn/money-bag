import { ITimed, ETable, createModel } from './shared'

export interface IFactoryContract extends ITimed {
  factoryContractId: number
  partnerId: number
  address: string
  status: 'ENABLED' | 'DISABLED'
  network: 'MAINNET' | 'RINKEBY'
  infuraKey: string
}

export class FactoryContract extends createModel<IFactoryContract>(ETable.FACTORY_CONTRACT) {}
