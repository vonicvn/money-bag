import { EMethod, createService, OnlyPartnerRoute } from '../../../shared'
import { param } from 'express-validator'
import { InputGetter } from './input-getter'
import { ApiExcutor } from './api-excutor'
import { InputValidator } from './input-validator'

export class Route extends OnlyPartnerRoute {
  path = '/api/v1/wallets'
  method = EMethod.GET
  Service = createService(InputGetter, InputValidator, ApiExcutor)
  getMidlewares() {
    return super.getMidlewares().concat([
      param('withdrawalId').isInt().exists(),
    ])
  }
}
