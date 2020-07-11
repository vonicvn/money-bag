import { ITimed, ETable, createModel } from './'

export enum ETransactionStatus {
  DETECTED = 'DETECTED',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface ITransaction extends ITimed {
  transactionId: number
  partnerId: number
  hash: string
  assetAddress: string
  walletId: number
  walletAddress: string
  status: ETransactionStatus
  assetId: number
  block: number
  value: number
}

export class Transaction extends createModel<ITransaction>(ETable.TRANSACTION) {}
