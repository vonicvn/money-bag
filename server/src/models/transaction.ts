import { ITimed, ETable, createModel } from './'

export interface ITransaction extends ITimed {
  transactionId: number
  partnerId: number
  hash: string
  assetAddress: string
  assetId: number
  block: number
  value: number
}

export class Transaction extends createModel<ITransaction>(ETable.TRANSACTION) {}
