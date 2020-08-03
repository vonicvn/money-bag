import { IWallet } from '../../../../global'

export interface IInput {
  page: number
  limit: number
  fromWalletId: number
}

export type IOutput = {
  wallets: IWallet[]
  total: number
}

export enum EErrorCode {}
