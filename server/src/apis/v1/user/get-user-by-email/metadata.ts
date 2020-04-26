import { IUser } from '../../../../global'

export interface IInput {
  email: string
}

export type IOutput = IUser

export enum EErrorCode {
  NOT_FOUND = 'NOT_FOUND',
}
