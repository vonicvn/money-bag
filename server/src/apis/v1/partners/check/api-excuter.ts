import { Partner } from '../../../../global'
import { AbstractApiExcutor } from '../../../shared'
import { IInput, IOutput } from './metadata'

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    const selectedFields = ['partnerId', 'name', 'created', 'modified', 'isAdmin', 'status', 'ethereumWallet', 'bitcoinWallet']
    return Partner.findById(
      this.partnerContext.partner.partnerId,
      builder => builder.select(selectedFields)
    )
  }
}
