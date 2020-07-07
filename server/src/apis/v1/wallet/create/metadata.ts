export interface IInput {
  partnerId: number
  quantity: number
}

export type IOutput = void

export enum EErrorCode {
  WALLET_CREATOR_BUSY = 'WALLET_CREATOR_BUSY',
}
