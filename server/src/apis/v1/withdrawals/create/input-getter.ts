import { IAbstractInputGetter } from '../../../../global'
import { IRequest } from '../../../shared'
import { IInput } from './metadata'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest) {
    return {
      requestId: parseInt(req.body.requestId),
      value: Number(req.body.value),
      assetId: Number(req.body.assetId),
      toAddress: String(req.body.toAddress),
    }
  }
}
