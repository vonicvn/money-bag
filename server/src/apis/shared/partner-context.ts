import { trim, defaultTo } from 'lodash'
import { exists, IRequest, IPartner, Partner } from '../../global'

export interface IPartnerContext {
  readonly isPartner: boolean
  readonly partner?: IPartner
}

export class PartnerContext implements IPartnerContext {
  constructor(public readonly partner: IPartner = null) {}

  get isPartner() { return exists(this.partner) }
}

export class PartnerContextManager {
  public static async getPartnerContext(req: IRequest): Promise<IPartnerContext> {
    try {
      const apiKey = trim(defaultTo(req.headers['X-API-KEY'], req.headers['x-api-key']))
      const partner = await Partner.findOne({ apiKey })
      return new PartnerContext(partner)
    } catch (error) {
      return new PartnerContext()
    }
  }
}
