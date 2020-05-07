import { RequestHandler } from 'express'
import {
  IRequest, IAbstractInputGetter, IRoute, PartnerContextManager, IPartnerContext,
  makeSure, EHttpStatusCode, AbstractInputValidator, IApiService, EMethod,
} from '.'

export class NullInputGetter implements IAbstractInputGetter<null> {
  getInput(_: IRequest): null {
    return null
  }
}

export class SkippedInputValidator extends AbstractInputValidator<null> {
  check(): Promise<void> {
    return
  }
}

export abstract class BaseRoute implements IRoute {
  abstract path: string
  abstract method: EMethod
  abstract Service: { new(): IApiService }
  abstract getMidlewares(): RequestHandler[]
}

export abstract class DefaultRoute extends BaseRoute {
  getMidlewares(): RequestHandler[] { return [] }
}

export abstract class PartnerContextLoadedRoute extends DefaultRoute {
  getMidlewares(): RequestHandler[] {
    return [
      ...super.getMidlewares(),
      async (req: IRequest, _, next) => {
        req.headers.partnerContext = await PartnerContextManager.getPartnerContext(req)
        next()
      },
    ]
  }
}

export abstract class OnlyPartnerRoute extends PartnerContextLoadedRoute {
  getMidlewares(): RequestHandler[] {
    return [
      ...super.getMidlewares(),
      async (req: IRequest, _, next) => {
        try {
          makeSure(
            (req.headers.partnerContext as IPartnerContext).isPartner,
            {
              message: 'Permission denied. Please login then try again.',
              code: 'PERMISSION_DENIED',
              statusCode: EHttpStatusCode.FORBIDDEN,
            }
          )
          next()
        } catch (error) {
          next(error)
        }
      },
    ]
  }
}

export abstract class OnlyAdminRoute extends OnlyPartnerRoute {
  getMidlewares(): RequestHandler[] {
    return [
      ...super.getMidlewares(),
      async (req: IRequest, _, next) => {
        try {
          makeSure(
            (req.headers.partnerContext as IPartnerContext).partner.isAdmin,
            {
              message: 'Permission denied. Please login with admin account',
              code: 'PERMISSION_DENIED',
              statusCode: EHttpStatusCode.FORBIDDEN,
            }
          )
          next()
        } catch (error) {
          next(error)
        }
      },
    ]
  }
}
