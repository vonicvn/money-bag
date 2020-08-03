export interface IInput {
  quantity: number
  partnerId: number
}

export type IOutput = void

export enum EErrorCode {
  OUT_OF_WALLET = 'OUT_OF_WALLET',
  PARTNER_NOT_FOUND = 'PARTNER_NOT_FOUND',
}
