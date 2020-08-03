import { body } from 'express-validator'
import { EMethod, createService, OnlyAdminRoute, SkippedInputValidator } from '../../../../shared'
import { ApiExcutor } from './api-excutor'
import { InputGetter } from './input-getter'

export class Route extends OnlyAdminRoute {
  path = '/api/v1/blocks/load'
  method = EMethod.POST
  Service = createService(InputGetter, SkippedInputValidator, ApiExcutor)
  getMidlewares() {
    return super.getMidlewares().concat([
      body('blockNumber').isInt().exists(),
    ])
  }
}
