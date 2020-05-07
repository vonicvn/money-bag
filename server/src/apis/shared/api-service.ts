import { IPartnerContext, PartnerContext } from './partner-context'
import { IRequest, IApiService } from '.'

export interface IAbstractInputGetter<T> {
  getInput(req: IRequest): T
}

export abstract class AbstractInputValidator<Input> {
  protected input: Input
  protected partnerContext: IPartnerContext

  validate(input: Input, partnerContext: IPartnerContext = new PartnerContext()): Promise<void> {
    this.input = input
    this.partnerContext = partnerContext
    return this.check()
  }

  abstract check(): Promise<void>
}

export abstract class BaseApiService implements IApiService {
  protected req: IRequest
  protected partnerContext: IPartnerContext

  abstract process(): Promise<unknown>

  public setContext(req: IRequest, partnerContext: IPartnerContext = new PartnerContext()) {
    this.req = req
    this.partnerContext = partnerContext
    return this
  }
}

export abstract class AbstractApiExcutor<Input, Output> extends BaseApiService {
  protected input: Input
  protected partnerContext: IPartnerContext

  excute(input: Input, partnerContext: IPartnerContext = new PartnerContext()): Promise<Output> {
    this.input = input
    this.partnerContext = partnerContext
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
    await this.inputValidator.validate(this.input, this.partnerContext)
    return this.excutor.excute(this.input, this.partnerContext)
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
