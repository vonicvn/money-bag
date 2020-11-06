import { IAbstractInputGetter } from '../../../../global'
import { IRequest } from '../../../shared'
import { IInput } from './metadata'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest) {
    return {
      requestId: String(req.body.requestId).trim(),
      value: Number(req.body.value),
      assetId: Number(req.body.assetId),
    }
  }
}
