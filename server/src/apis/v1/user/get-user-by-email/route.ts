import { OnlyUserRoute, EMethod, createService } from '../../../../apis/shared'
import { InputGetter, InputValidator, ApiExcutor } from './service'

export class Route extends OnlyUserRoute {
  path = '/api/v1/users'
  method = EMethod.GET
  Service = createService(InputGetter, InputValidator, ApiExcutor)
}
