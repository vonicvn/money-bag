import {
  FactoryContract, DepositContract, makeSure,
  IAbstractInputGetter, AbstractInputValidator,
} from '../../../../global'
import { AbstractApiExcutor, IRequest, EHttpStatusCode, mustExist } from '../../../shared'
import { IInput, IOutput, EErrorCode } from './metadata'
import { defaultTo } from 'lodash'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest) {
    return {
      factoryContractId: Number(req.params.factoryContractId),
      fromDepositContractId: Number(defaultTo(req.query.fromDepositContractId, 0)),
    }
  }
}

export class InputValidator extends AbstractInputValidator<IInput> {
  async check(): Promise<void> {
    makeSure(
      isFinite(this.input.factoryContractId),
      {
        message: 'Invalid factoryContractId',
        code: EErrorCode.INVALID_FACTORY_CONTRACT_ID,
        statusCode: EHttpStatusCode.BAD_REQEUEST,
      }
    )

    makeSure(
      isFinite(this.input.fromDepositContractId),
      {
        message: 'Invalid fromDepositContractId',
        code: EErrorCode.INVALID_FACTORY_CONTRACT_ID,
        statusCode: EHttpStatusCode.BAD_REQEUEST,
      }
    )

    const factoryContract = await FactoryContract.findOne({
      factoryContractId: this.input.factoryContractId,
      partnerId: this.partnerContext.partner.partnerId,
    })
    mustExist(
      factoryContract,
      {
        message: 'Not found factory contract',
        code: EErrorCode.FACTORY_CONTRACT_NOT_FOUND,
        statusCode: EHttpStatusCode.NOT_FOUND,
      }
    )
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    return DepositContract.findAll(
      { factoryContractId: this.input.factoryContractId },
      builder => builder
        .where('depositContractId', '>=', this.input.fromDepositContractId)
        .orderBy('depositContractId')
    )
  }
}
