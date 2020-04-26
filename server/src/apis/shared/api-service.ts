import { IUserContext, UserContext } from './user-context'
import { IRequest, IApiService } from '.'

export interface IAbstractInputGetter<T> {
  getInput(req: IRequest): T
}

export abstract class AbstractInputValidator<Input> {
  protected input: Input
  protected userContext: IUserContext

  validate(input: Input, userContext: IUserContext = new UserContext()): Promise<void> {
    this.input = input
    this.userContext = userContext
    return this.check()
  }

  abstract check(): Promise<void>
}

export abstract class BaseApiService implements IApiService {
  protected req: IRequest
  protected userContext: IUserContext

  abstract process(): Promise<unknown>

  public setContext(req: IRequest, userContext: IUserContext = new UserContext()) {
    this.req = req
    this.userContext = userContext
    return this
  }
}

export abstract class AbstractApiExcutor<Input, Output> extends BaseApiService {
  protected input: Input
  protected userContext: IUserContext

  excute(input: Input, userContext: IUserContext = new UserContext()): Promise<Output> {
    this.input = input
    this.userContext = userContext
    return this.process()
  }

  abstract process(): Promise<Output>
}

export abstract class ApiService<Input = void, Output = void> extends BaseApiService {
  input: Input
  abstract inputGetter: IAbstractInputGetter<Input>
  abstract inputValidator: AbstractInputValidator<Input>
  abstract excutor: AbstractApiExcutor<Input, Output>

  public async process(): Promise<Output> {
    this.input = this.inputGetter.getInput(this.req)
    await this.inputValidator.validate(this.input, this.userContext)
    return this.excutor.excute(this.input, this.userContext)
  }
}

export function createService<Input, Output>(
  ClassOfInputGetter: { new(): IAbstractInputGetter<Input> },
  ClassOfInputValidator: { new(): AbstractInputValidator<Input> },
  ClassOfApiExcutor: { new(): AbstractApiExcutor<Input, Output> }
) {
  return class extends ApiService<Input, Output> {
    inputGetter = new ClassOfInputGetter()
    inputValidator = new ClassOfInputValidator()
    excutor =  new ClassOfApiExcutor()
  }
}
