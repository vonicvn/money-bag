import {
  IWithdrawal,
} from '../../../../global'

export interface IInput {
  requestId: string
  value: number
  assetId: number
}

export type IOutput = IWithdrawal

export enum EErrorCode {
  ASSET_NOT_FOUND = 'ASSET_NOT_FOUND',
  DUPLICATE_REQUEST_ID = 'DUPLICATE_REQUEST_ID',
}
