import { AbstractApiExcutor } from '../../../../shared'
import { IInput, IOutput } from './metadata'
import { Transaction } from '../../../../../global'
import { TransactionsGetter } from '../../../../../cron/ethereum/transactions-getter'

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    const transactions = await new TransactionsGetter(this.input.blockNumber).get()
    await Transaction.createMany(transactions)
  }
}
