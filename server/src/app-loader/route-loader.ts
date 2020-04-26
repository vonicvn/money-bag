import { isNil } from 'lodash'
import { Express, Request, Response, NextFunction } from 'express'
import {
  Env, EEnvKey, EEnviroment, IRequest, IRoute,
  ApiError, EHttpStatusCode, handleUnexpectedError,
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
      if (isUnexpectedError) handleUnexpectedError(error)
      const statusCode = isUnexpectedError ? EHttpStatusCode.INTERNAL_SERVER_ERROR : error.statusCode
      res.status(statusCode).send({ code: error.code, message: this.getErrorMessage(error) })
    })
  }

  private static async appendRoute(app: Express, route: IRoute) {
    app[route.method](route.path, ...route.getMidlewares(), async (req: IRequest, res, next) => {
      new route
          .Service()
          .setContext(req, req.headers.userContext)
          .process()
          .then(res.send.bind(res))
          .catch(next)
    })
  }

  private static getErrorMessage (error: ApiError) {
    if (isNil(error.statusCode) && Env.get(EEnvKey.NODE_ENV) === EEnviroment.PRODUCTION) return 'INTERNAL_SERVER_ERROR'
    return error.message
  }
}
