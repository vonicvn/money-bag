import { IAbstractInputGetter } from '../../../../global'
import { IRequest } from '../../../shared'
import { IInput } from './metadata'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest) {
    return {
      withdrawalId: Number(req.params.withdrawalId),
    }
  }
}
