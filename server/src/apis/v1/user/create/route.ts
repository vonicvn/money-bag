import { EMethod, DefaultRoute, createService } from '../../../../apis/shared'
import { InputGetter, InputValidator, ApiExcutor } from './service'

export class Route extends DefaultRoute {
  path = '/api/v1/users/create'
  method = EMethod.POST
  Service = createService(InputGetter, InputValidator, ApiExcutor)
}
