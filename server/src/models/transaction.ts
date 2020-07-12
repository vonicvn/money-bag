import { ITimed, ETable, createModel } from './'

export enum ETransactionStatus {
  WAITING = 'WAITING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
}

export interface ITransaction extends ITimed {
  transactionId: number
  partnerId: number
  hash: string
  assetAddress: string
  walletId: number
  walletAddress: string
  collectingStatus: ETransactionStatus
  isConfirmed: boolean
  assetId: number
  block: number
  value: number
}

export class Transaction extends createModel<ITransaction>(ETable.TRANSACTION) {}
