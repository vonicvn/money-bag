import { ITimed, ETable, createModel } from './'

export enum ECollectingStatus {
  WAITING = 'WAITING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
}

export interface ITransaction extends ITimed {
  transactionId: number
  partnerId: number
  hash: string

  assetAddress: string
  assetName: string
  assetId: number

  walletId: number
  walletAddress: string
  collectingStatus: ECollectingStatus

  block: number
  value: number
}

export class Transaction extends createModel<ITransaction>(ETable.TRANSACTION) {}
