import { ITimed, ETable, createModel } from './'

export interface ITransaction extends ITimed {
  transactionId: number
  depositContractId: number
  hash: string
  coinAddress: string
  block: number
  value: number
}

export class Transaction extends createModel<ITransaction>(ETable.TRANSACTION) {}
