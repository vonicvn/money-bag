import { IWallet } from '../../../../global'

export interface IInput {
  numberOfNewWallets: number
}

export type IOutput = IWallet[]

export enum EErrorCode {
  NUMBER_OF_WALLET_TOO_BIG = 'NUMBER_OF_WALLET_TOO_BIG',
}
