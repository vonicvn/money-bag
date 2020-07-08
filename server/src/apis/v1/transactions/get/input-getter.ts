import { defaultTo } from 'lodash'
import { IAbstractInputGetter, exists } from '../../../../global'
import { IRequest } from '../../../shared'
import { IInput } from './metadata'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest) {
    const MAX_WALLET_PER_FETCH = 100
    return {
      page: Number(defaultTo(req.query.page, 1)),
      limit: Math.min(
        Number(defaultTo(req.query.limit, 10)),
        MAX_WALLET_PER_FETCH
      ),
      fromTransactionId: Number(defaultTo(req.query.fromTransactionId, 1)),
      ...exists(req.query.tokenId) && { tokenId: Number(req.query.tokenId) },
    }
  }
}
