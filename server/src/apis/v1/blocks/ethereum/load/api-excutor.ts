import { AbstractApiExcutor } from '../../../../shared'
import { IInput, IOutput } from './metadata'
import { NewTransactionsLoader } from '../../../../../cron/ethereum/new-transactions-loader'

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    await new NewTransactionsLoader(this.input.network).scan(this.input.blockNumber)
  }
}
