import { EHttpStatusCode } from '.'

export interface IApiError {
  message: string
  code: string
  statusCode: EHttpStatusCode
}

export class ApiError extends Error implements IApiError  {
  public code: string
  public statusCode: EHttpStatusCode
  constructor({ message, code, statusCode }: IApiError) {
    super(message)
    this.code = code
    this.statusCode = statusCode
  }
}
