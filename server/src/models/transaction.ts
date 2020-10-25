import { ITimed, ETable, createModel, EBlockchainNetwork } from './'

export enum ECollectingStatus {
  WAITING = 'WAITING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
}

export interface ITransaction extends ITimed {
  transactionId: number
  partnerId: number
  hash: string
  block: number
  value: number

  assetAddress: string
  assetName: string
  assetId: number

  walletId: number
  walletAddress: string
  collectingStatus: ECollectingStatus
  network: EBlockchainNetwork

  collectingHash: string
  collectingBlock: number
}

export class Transaction extends createModel<ITransaction>(ETable.TRANSACTION) {}
