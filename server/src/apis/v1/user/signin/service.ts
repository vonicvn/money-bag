import { trim } from 'lodash'
import { compare } from 'bcrypt'
import { User, JWT, Password } from '../../../../global'
import {
  IAbstractInputGetter, AbstractInputValidator, mustExist,
  IRequest, AbstractApiExcutor, makeSure, EHttpStatusCode,
} from '../../../shared'
import { IInput, IOutput, EErrorCode } from './metadata'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest): IInput {
    const { email, password } = req.body
    return {
      email: trim(email),
      password,
    }
  }
}

export class InputValidator extends AbstractInputValidator<IInput> {
  async check() {
    const user = await User.findOne({ email: this.input.email })
    mustExist(user, {
      message: 'Wrong email or password',
      code: EErrorCode.INVALID_CREDENTIALS,
      statusCode: EHttpStatusCode.CONFLICT,
    })

    const password = await Password.findById(user.id)
    makeSure(
      await compare(this.input.password, password.passwordHash),
      {
        message: 'Wrong email or password',
        code: EErrorCode.INVALID_CREDENTIALS,
        statusCode: EHttpStatusCode.CONFLICT,
      }
    )
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {

  async process() {
    const user = await User.findOne({ email: this.input.email })
    const token = await JWT.createToken({ id: user.id })
    return { access_token: token }
  }
}
