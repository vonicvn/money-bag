import { Withdrawal, mustExist } from '../../../../global'
import { AbstractInputValidator, EHttpStatusCode } from '../../../shared'
import { IInput, EErrorCode } from './metadata'

export class InputValidator extends AbstractInputValidator<IInput> {
  async check(): Promise<void> {
    mustExist(
      await Withdrawal.findOne({
        withdrawalId: this.input.withdrawalId,
        partnerId: this.partnerContext.partner.partnerId,
      }),
      {
        message: 'Withdrawal not found',
        code: EErrorCode.WITHDRAWAL_NOT_FOUND,
        statusCode: EHttpStatusCode.NOT_FOUND,
      }
    )
  }
}
