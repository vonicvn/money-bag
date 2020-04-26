import { defaultTo } from 'lodash'
import { User } from '../../../../global'
import {
  IAbstractInputGetter, IRequest, EHttpStatusCode,
  AbstractApiExcutor, AbstractInputValidator, mustExist,
} from '../../../shared'
import { IInput, IOutput, EErrorCode } from './metadata'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest): IInput {
    return {
      email: String(defaultTo(req.query.email, '')).trim(),
    }
  }
}

export class InputValidator extends AbstractInputValidator<IInput> {
  async check() {
    const user = await User.findOne({ email: this.input.email })
    mustExist(user, {
      message: 'Account not found',
      code: EErrorCode.NOT_FOUND,
      statusCode: EHttpStatusCode.NOT_FOUND,
    })
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    return User.findOne({ email: this.input.email })
  }
}
