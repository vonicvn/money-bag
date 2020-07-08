import { EMethod, createService, OnlyPartnerRoute, SkippedInputValidator } from '../../../shared'
import { query } from 'express-validator'
import { InputGetter } from './input-getter'
import { ApiExcutor } from './api-excutor'

export class Route extends OnlyPartnerRoute {
  path = '/api/v1/transactions'
  method = EMethod.GET
  Service = createService(InputGetter, SkippedInputValidator, ApiExcutor)
  getMidlewares() {
    return super.getMidlewares().concat([
      query('page').isInt().optional(),
      query('limit').isInt().optional(),
      query('fromTransactionId').isInt().optional(),
      query('tokenId').isInt().optional(),
    ])
  }
}
