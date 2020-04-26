export interface IInput {
  email: string
  name: string
  password: string
}

export type IOutput = void

export enum EErrorCode {
  ACCOUNT_EXISTS = 'ACCOUNT_EXISTS',
  PASSWORD_MUST_BE_LONGER_THAN_8 = 'PASSWORD_MUST_BE_LONGER_THAN_8',
}
