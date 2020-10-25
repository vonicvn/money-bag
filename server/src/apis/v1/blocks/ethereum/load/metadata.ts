import {
  EBlockchainNetwork,
} from '../../../../../global'

export interface IInput {
  blockNumber: number
  network: EBlockchainNetwork
}

export type IOutput = void

export enum EErrorCode {}
