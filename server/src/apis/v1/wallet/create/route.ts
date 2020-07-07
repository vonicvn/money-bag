import { EMethod, createService, OnlyPartnerRoute, SkippedInputValidator } from '../../../shared'
import { ApiExcutor, InputGetter } from './service'

export class Route extends OnlyPartnerRoute {
  path = '/api/v1/wallet'
  method = EMethod.GET
  Service = createService(InputGetter, SkippedInputValidator, ApiExcutor)
}
