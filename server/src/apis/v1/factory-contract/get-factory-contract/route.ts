import { EMethod, createService, OnlyPartnerRoute, NullInputGetter, SkippedInputValidator } from '../../../../apis/shared'
import { ApiExcutor } from './service'

export class Route extends OnlyPartnerRoute {
  path = '/api/v1/factory-contracts'
  method = EMethod.GET
  Service = createService(NullInputGetter, SkippedInputValidator, ApiExcutor)
}
