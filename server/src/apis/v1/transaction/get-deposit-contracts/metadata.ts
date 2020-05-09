import { ITransaction } from '../../../../global'

export interface IInput {
  factoryContractId: number
  fromTransactionId: number
}

export type IOutput = ITransaction[]

export enum EErrorCode {
  INVALID_FACTORY_CONTRACT_ID = 'INVALID_FACTORY_CONTRACT_ID',
  INVALID_FROM_TRANSACTION_ID = 'INVALID_FROM_TRANSACTION_ID',
  FACTORY_CONTRACT_NOT_FOUND = 'FACTORY_CONTRACT_NOT_FOUND',
}
