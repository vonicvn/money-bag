import { ITransaction } from '../../../../global'

export interface IInput {
  page: number
  limit: number
  fromTransactionId: number
  assetId?: number
}

export type IOutput = {
  transactions: ITransaction[]
  total: number
}

export enum EErrorCode {}
