import { ITimed, ETable, createModel } from './shared'

export interface ITransaction extends ITimed {
  transactionId: number
  depositContractId: number
  hash: string
  coinAddress: string
  block: number
  value: string
}

export class Transaction extends createModel<ITransaction>(ETable.TRANSACTION) {}
