import { FactoryContract } from '../../../../global'
import { AbstractApiExcutor } from '../../../shared'
import { IInput, IOutput } from './metadata'

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    return FactoryContract.findAll(
      { partnerId: this.partnerContext.partner.partnerId },
      builder => builder.orderBy('factoryContractId')
    )
  }
}
