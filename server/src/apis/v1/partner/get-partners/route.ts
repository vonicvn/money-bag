import { OnlyAdminRoute, EMethod, createService, SkippedInputValidator, NullInputGetter } from '../../../../apis/shared'
import { ApiExcutor } from './api-excuter'

export class Route extends OnlyAdminRoute {
  path = '/api/v1/partners'
  method = EMethod.GET
  Service = createService(NullInputGetter, SkippedInputValidator, ApiExcutor)
}
