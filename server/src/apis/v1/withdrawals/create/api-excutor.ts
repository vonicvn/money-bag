import { Withdrawal } from '../../../../global'
import { AbstractApiExcutor } from '../../../shared'
import { IInput, IOutput } from './metadata'

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    const withdrawal = await Withdrawal.create({
      partnerId: this.partnerContext.partner.partnerId,
      ...this.input,
    })

    return withdrawal
  }
}
