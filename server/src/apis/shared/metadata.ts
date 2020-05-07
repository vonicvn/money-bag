import { RequestHandler } from 'express'
import { IPartnerContext } from './partner-context'

export enum EMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

// tslint:disable-next-line: no-any
type Any = any

export interface IRequest {
  params?: Any
  body?: Any
  headers?: Any
  query?: Any
}

export interface IApiService {
  process(): Promise<unknown>
  setContext(req: IRequest, partnerContext: IPartnerContext): IApiService
}

export interface IRoute {
  path: string
  method: EMethod
  Service: { new (): IApiService }
  getMidlewares(): RequestHandler[]
}

export enum EHttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQEUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}
