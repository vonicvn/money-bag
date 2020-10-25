import {
  Wallet,
  Partner,
  makeSure,
  mustExist,
  EHttpStatusCode,
  AbstractInputValidator,
  EBlockchainNetwork,
} from '../../../../global'
import {
  IInput,
  EErrorCode,
} from './metadata'

export class InputValidator extends AbstractInputValidator<IInput> {
  async check(): Promise<void> {
    mustExist(
      await Partner.findById(this.input.partnerId),
      {
        message: 'Partner not found',
        code: EErrorCode.PARTNER_NOT_FOUND,
        statusCode: EHttpStatusCode.NOT_FOUND,
      }
    )

    const availableWalletCount = await Wallet.count({
      partnerId: null,
      network: this.input.network,
    })

    makeSure(
      availableWalletCount > this.input.quantity,
      {
        message: 'Do not have enough wallets, please create more.',
        code: EErrorCode.OUT_OF_WALLET,
        statusCode: EHttpStatusCode.CONFLICT,
      }
    )
  }
}
