import { IAbstractInputGetter } from '../../../../global'
import { IRequest } from '../../../shared'
import { IInput } from './metadata'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest) {
    return { quantity: Number(req.body.quantity) }
  }
}
