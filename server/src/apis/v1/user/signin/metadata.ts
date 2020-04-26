export interface IInput {
  email: string
  password: string
}

export type IOutput = { access_token: string }

export enum EErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
}
