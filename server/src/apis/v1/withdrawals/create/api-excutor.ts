import { Asset, Withdrawal, BlockchainJob, EBlockchainJobType } from '../../../../global'
import { AbstractApiExcutor } from '../../../shared'
import { IInput, IOutput } from './metadata'

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    const withdrawal = await Withdrawal.create({
      partnerId: this.partnerContext.partner.partnerId,
      ...this.input,
    })

    const asset = await Asset.findById(this.input.assetId)

    await BlockchainJob.create({
      transactionId: withdrawal.withdrawalId,
      network: asset.network,
      type: EBlockchainJobType.WITHDRAW_FROM_HOT_WALLET,
    })

    return withdrawal
  }
}
