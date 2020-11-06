import { isNil } from 'lodash'
import { Withdrawal, Asset, makeSure, mustExist } from '../../../../global'
import { AbstractInputValidator, EHttpStatusCode } from '../../../shared'
import { IInput, EErrorCode } from './metadata'

export class InputValidator extends AbstractInputValidator<IInput> {
  async check(): Promise<void> {
    makeSure(
      isNil(await Withdrawal.findOne({
        requestId: this.input.requestId,
        partnerId: this.partnerContext.partner.partnerId,
      })),
      {
        message: 'Duplicate request id',
        code: EErrorCode.DUPLICATE_REQUEST_ID,
        statusCode: EHttpStatusCode.CONFLICT,
      }
    )

    mustExist(
      await Asset.findById(this.input.assetId),
      {
        message: 'Asset not found',
        code: EErrorCode.ASSET_NOT_FOUND,
        statusCode: EHttpStatusCode.NOT_FOUND,
      }
    )
  }
}
