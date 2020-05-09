import { IDepositContract } from '../../../../global'

export interface IInput {
  factoryContractId: number
  fromDepositContractId: number
}

export type IOutput = IDepositContract[]

export enum EErrorCode {
  INVALID_FACTORY_CONTRACT_ID = 'INVALID_FACTORY_CONTRACT_ID',
  INVALID_FROM_DEPOSIT_CONTRACT_ID = 'INVALID_FACTORY_CONTRACT_ID',
  FACTORY_CONTRACT_NOT_FOUND = 'FACTORY_CONTRACT_NOT_FOUND',
}
