import { pick } from 'lodash'
import td from 'testdouble'
import express from 'express'
import request from 'supertest'
import { deepEqual } from 'assert'
import {
  TestUtils, EHttpStatusCode, EEnviroment, EMethod, IRoute,
  makeSure, Env, ErrorHandler, BaseApiService,
} from '../../global'
import { RouteLoader } from '../route-loader'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

class AddService extends BaseApiService {
  async process() {
    if (isNaN(this.req.query.a)) throw new Error('INVALID_PARAM_A')
    makeSure(
      !isNaN(this.req.query.b),
      {
        code: 'INVALID_PARA_B',
        message: 'Parameter B is invalid',
        statusCode: EHttpStatusCode.BAD_REQEUEST,
      }
    )
    return { result: Number(this.req.query.a) + Number(this.req.query.b) }
  }
}

describe(TEST_TITLE, () => {
  const route: IRoute = {
    path: '/add',
    Service: AddService,
    method: EMethod.GET,
    getMidlewares: () => [],
  }

  beforeEach(TEST_TITLE, () => {
    td.replace(ErrorHandler, 'handle')
  })

  it(`${TEST_TITLE} RouteLoader works`, async () => {
    const app = express()
    await RouteLoader.load(app, [route])

    // success case
    const response1 = await request(app).get('/add').query({ a: 1, b: 2 })
    deepEqual(
      pick(response1, 'body', 'status'),
      {
        body: { result: 3 },
        status: EHttpStatusCode.OK,
      }
    )

    // handled error
    const response2 = await request(app).get('/add').query({ a: 1 })
    deepEqual(
      pick(response2, 'body', 'status'),
      {
        body: { code: 'INVALID_PARA_B', message: 'Parameter B is invalid' },
        status: EHttpStatusCode.BAD_REQEUEST,
      }
    )

    // unhandled error in dev envs
    const response3 = await request(app).get('/add').query({ b: 2 })
    deepEqual(
      pick(response3, 'body', 'status'),
      {
        body: { message: 'INVALID_PARAM_A' },
        status: EHttpStatusCode.INTERNAL_SERVER_ERROR,
      }
    )
    td.verify(ErrorHandler.handle(new Error('INVALID_PARAM_A')))

    // unhandled error in prod env
    td.replace(Env, 'get', () => EEnviroment.PRODUCTION)
    const response4 = await request(app).get('/add').query({ b: 2 })
    deepEqual(
      pick(response4, 'body', 'status'),
      {
        body: { message: 'INTERNAL_SERVER_ERROR' },
        status: EHttpStatusCode.INTERNAL_SERVER_ERROR,
      }
    )

    // invalid route
    const response5 = await request(app).get('/invalid-route')
    deepEqual(
      pick(response5, 'body', 'status'),
      {
        body: { code: 'INVALID_ROUTE', message: 'Requested route does not exist' },
        status: EHttpStatusCode.NOT_FOUND,
      }
    )
  })
})
