import { RequestHandler } from 'express'
import {
  IRequest, IAbstractInputGetter, IRoute, UserContextManager, IUserContext,
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

export abstract class UserContextLoadedRoute extends DefaultRoute {
  getMidlewares(): RequestHandler[] {
    return [
      ...super.getMidlewares(),
      async (req: IRequest, _, next) => {
        req.headers.userContext = await UserContextManager.getUserContext(req)
        next()
      },
    ]
  }
}

export abstract class OnlyUserRoute extends UserContextLoadedRoute {
  getMidlewares(): RequestHandler[] {
    return [
      ...super.getMidlewares(),
      async (req: IRequest, _, next) => {
        try {
          makeSure(
            (req.headers.userContext as IUserContext).isUser,
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
