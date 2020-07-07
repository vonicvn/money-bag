import { isNil } from 'lodash'
import { Express, Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import {
  Env, EEnvKey, EEnviroment, IRequest, IRoute,
  ApiError, EHttpStatusCode, ErrorHandler,
} from '../global'

export class RouteLoader {
  static async load(app: Express, routes: IRoute[]) {
    await Promise.all(routes.map(route => this.appendRoute(app, route)))

    app.all('*', (_, res) => {
      res
        .status(EHttpStatusCode.NOT_FOUND)
        .send({ code: 'INVALID_ROUTE', message: 'Requested route does not exist' })
    })

    app.use((error: ApiError, _: Request, res: Response, __: NextFunction) => {
      const isUnexpectedError = isNil(error.statusCode)
      if (isUnexpectedError) ErrorHandler.handle(error)
      const statusCode = isUnexpectedError ? EHttpStatusCode.INTERNAL_SERVER_ERROR : error.statusCode
      res.status(statusCode).send({ code: error.code, message: this.getErrorMessage(error) })
    })
  }

  private static async appendRoute(app: Express, route: IRoute) {
    app[route.method](route.path, ...route.getMidlewares(), async (req: IRequest, res, next) => {
      const errors = validationResult(req)

      if (errors.isEmpty()) return new route
        .Service()
        .setContext(req, req.headers.partnerContext)
        .process()
        .then(res.send.bind(res))
        .catch(next)

      return res.status(422).json({
        errors: errors.array(),
        code: 'INVALID_PARAMETERS',
        message: 'Some of parameters are invalid',
      })
    })
  }

  private static getErrorMessage (error: ApiError) {
    if (isNil(error.statusCode) && Env.get(EEnvKey.NODE_ENV) === EEnviroment.PRODUCTION) return 'INTERNAL_SERVER_ERROR'
    return error.message
  }
}
