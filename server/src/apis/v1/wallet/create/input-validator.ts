import { WalletService } from '../../../../global'
import { makeSure, AbstractInputValidator, EHttpStatusCode } from '../../../shared'
import { IInput, EErrorCode } from './metadata'

export class InputValidator extends AbstractInputValidator<IInput> {
  async check(): Promise<void> {
    makeSure(
      !WalletService.isCreatingWallet,
      {
        message: 'Wallet Creator is busy now, try later',
        code: EErrorCode.WALLET_CREATOR_BUSY,
        statusCode: EHttpStatusCode.CONFLICT,
      }
    )
  }
}