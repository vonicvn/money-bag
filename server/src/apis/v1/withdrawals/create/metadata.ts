import {
  IWithdrawal,
} from '../../../../global'

export interface IInput {
  requestId: number
  value: number
  assetId: number
  toAddress: string
}

export type IOutput = IWithdrawal

export enum EErrorCode {
  ASSET_NOT_FOUND = 'ASSET_NOT_FOUND',
  DUPLICATE_REQUEST_ID = 'DUPLICATE_REQUEST_ID',
}
