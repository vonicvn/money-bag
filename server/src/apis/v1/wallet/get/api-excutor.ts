import { Wallet } from '../../../../global'
import { AbstractApiExcutor } from '../../../shared'
import { IInput, IOutput } from './metadata'

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    const wallets = await Wallet.findAll(
      { partnerId: this.partnerContext.partner.partnerId },
      builder => {
        return builder
          .where('walletId', '>=', this.input.fromWalletId)
          .offset((this.input.page - 1) * this.input.limit)
          .limit(this.input.limit)
          .orderBy('walletId')
      }
    )

    const total = await Wallet.count({ partnerId: this.partnerContext.partner.partnerId })

    return {
      wallets,
      total,
    }
  }
}
