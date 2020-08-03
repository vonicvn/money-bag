import { WalletService } from '../../../../global'
import { AbstractApiExcutor } from '../../../shared'
import { IInput, IOutput } from './metadata'

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    new WalletService().createWallet(this.input.quantity)
  }
}
