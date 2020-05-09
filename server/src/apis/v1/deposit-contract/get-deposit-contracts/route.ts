import { EMethod, createService, OnlyPartnerRoute } from '../../../../apis/shared'
import { ApiExcutor, InputGetter, InputValidator } from './service'

export class Route extends OnlyPartnerRoute {
  path = '/api/v1/deposit-contracts/:factoryContractId'
  method = EMethod.GET
  Service = createService(InputGetter, InputValidator, ApiExcutor)
}
