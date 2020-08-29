import { OnlyPartnerRoute, EMethod, createService, SkippedInputValidator, NullInputGetter } from '../../../../apis/shared'
import { ApiExcutor } from './api-excuter'

export class Route extends OnlyPartnerRoute {
  path = '/api/v1/partners/check'
  method = EMethod.GET
  Service = createService(NullInputGetter, SkippedInputValidator, ApiExcutor)
}
