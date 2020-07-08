import { ITransaction } from '../../../../global'

export interface IInput {
  page: number
  limit: number
  fromTransactionId: number
  tokenId?: number
}

export type IOutput = {
  transactions: ITransaction[]
  total: number
}

export enum EErrorCode {}
