import { map } from 'lodash'
import { Wallet } from '../../../../global'
import { AbstractApiExcutor } from '../../../shared'
import { IInput, IOutput } from './metadata'

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    const wallets = await Wallet.findAll({ partnerId: null }, builder => {
      return builder
        .select('walletId')
        .orderBy('walletId')
        .limit(this.input.quantity)
    })

    await Wallet.updateMany(
      {},
      { partnerId: this.input.partnerId },
      builder => builder.whereIn('walletId', map(wallets, 'walletId'))
    )
  }
}
