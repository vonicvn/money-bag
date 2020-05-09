import { ITimed, ETable, createModel } from './shared'

export interface IDepositContract extends ITimed {
  depositContractId: number
  factoryContractId: number
  address: string
  block: number
}

export class DepositContract extends createModel<IDepositContract>(ETable.DEPOSIT_CONTRACT) {}
