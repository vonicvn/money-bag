import { Partner } from '../../../../global'
import { AbstractApiExcutor } from '../../../shared'
import { IInput, IOutput } from './metadata'

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    const selectedFields = ['partnerId', 'name', 'created', 'modified', 'isAdmin', 'status']
    return Partner.findAll({ }, builder => builder.select(selectedFields))
  }
}
