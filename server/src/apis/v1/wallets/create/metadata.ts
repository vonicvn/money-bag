import {
  EBlockchainNetwork,
} from '../../../../global'

export interface IInput {
  quantity: number
  network: EBlockchainNetwork
}

export type IOutput = void

export enum EErrorCode {
  WALLET_CREATOR_BUSY = 'WALLET_CREATOR_BUSY',
}
