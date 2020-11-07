import {
  ITimed,
  ETable,
  createModel,
} from './'

export enum EWithdrawalStatus {
  WAITING = 'WAITING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
}

export interface IWithdrawal extends ITimed {
  withdrawalId: number
  partnerId: number
  requestId: number
  hash: string
  value: number
  assetId: number
  status: EWithdrawalStatus
  toAddress: string
}

export class Withdrawal extends createModel<IWithdrawal>(ETable.WITHDRAWAL) {}
