import {
  FactoryContract, makeSure, Transaction,
  IAbstractInputGetter, AbstractInputValidator,
} from '../../../../global'
import { AbstractApiExcutor, IRequest, EHttpStatusCode, mustExist } from '../../../shared'
import { IInput, IOutput, EErrorCode } from './metadata'
import { defaultTo } from 'lodash'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest) {
    return {
      factoryContractId: Number(req.params.factoryContractId),
      fromTransactionId: Number(defaultTo(req.query.fromTransactionId, 0)),
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
      isFinite(this.input.fromTransactionId),
      {
        message: 'Invalid fromTransactionId',
        code: EErrorCode.INVALID_FROM_TRANSACTION_ID,
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
    return Transaction.findAll({}, builder => {
      return builder
        .select(['transactionId', 'transaction.depositContractId', 'value', 'hash'])
        .where('transactionId', '>=', this.input.fromTransactionId)
        .where('depositContract.factoryContractId', '=', this.input.factoryContractId)
        .innerJoin('depositContract', 'depositContract.depositContractId', 'transaction.depositContractId')
        .orderBy('transactionId')
    })
  }
}
