import { trim, isNil } from 'lodash'
import { hash } from 'bcrypt'
import { User, Password } from '../../../../global'
import {
  IAbstractInputGetter, AbstractInputValidator, IRequest,
  AbstractApiExcutor, makeSure, EHttpStatusCode,
} from '../../../shared'
import { IInput, IOutput, EErrorCode } from './metadata'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest): IInput {
    const { email, name, password } = req.body
    return {
      email: trim(email),
      name: trim(name),
      password,
    }
  }
}

export class InputValidator extends AbstractInputValidator<IInput> {
  async check() {
    makeSure (this.input.password.length >= 8, {
      message: 'Your password must be longer than 8',
      code: EErrorCode.PASSWORD_MUST_BE_LONGER_THAN_8,
      statusCode: EHttpStatusCode.BAD_REQEUEST,
    })

    const user = await User.findOne({ email: this.input.email })
    makeSure(isNil(user), {
      message: 'Email has been used already',
      code: EErrorCode.ACCOUNT_EXISTS,
      statusCode: EHttpStatusCode.CONFLICT,
    })
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process() {
    const user = await User.create({
      email: this.input.email,
      name: this.input.name,
    })
    const passwordHash = await hash(this.input.password, 8)
    await Password.create({ id: user.id, passwordHash })
  }
}
