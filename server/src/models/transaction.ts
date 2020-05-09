import { ITimed, ETable, createModel } from './shared'

export interface ITransaction extends ITimed {
  transactionId: number
  depositContractId: number
  hash: string
  block: number
  value: number
}

export class Transaction extends createModel<ITransaction>(ETable.TRANSACTION) {}
