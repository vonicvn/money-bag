import { IAbstractInputGetter } from '../../../../global'
import { IRequest } from '../../../shared'
import { IInput } from './metadata'
import { defaultTo } from 'lodash'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest) {
    const MAX_WALLET_PER_FETCH = 100
    return {
      page: Number(defaultTo(req.query.page, 1)),
      limit: Math.min(
        Number(defaultTo(req.query.limit, 10)),
        MAX_WALLET_PER_FETCH
      ),
      fromWalletId: Number(defaultTo(req.query.fromWalletId, 1)),
    }
  }
}
