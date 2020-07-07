import express from 'express'
import request from 'supertest'
import { deepEqual, equal } from 'assert'
import { TestUtils, RouteLoader, EHttpStatusCode, Partner, deepOmit } from '../../../../global'
import { Route } from './route'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  const app = express()

  const ADMIN_API_KEY = 'i_am_the_admin'
  const NORMAL_PARNER_API_KEY = 'i_am_normal_partner'

  beforeEach(TEST_TITLE, async () => {
    await RouteLoader.load(app, [new Route()])
    await Partner.createMany([
      { partnerId: 1, name: 'Testing Partner 1', isAdmin: true, apiKey: ADMIN_API_KEY },
      { partnerId: 2, name: 'Testing Partner 2', apiKey: NORMAL_PARNER_API_KEY },
    ])
  })

  it(`${TEST_TITLE} Can list partners`, async () => {
    const response = await request(app)
      .get('/api/v1/partners')
      .set({ 'X-API-KEY': ADMIN_API_KEY })

    deepEqual(
      deepOmit(response.body, ['created', 'modified', 'bitcoinWallet', 'ethereumWallet']),
      [
        {
          partnerId: 1,
          name: 'Testing Partner 1',
          isAdmin: true,
          status: 'ENABLED',
        },
        {
          partnerId: 2,
          name: 'Testing Partner 2',
          isAdmin: false,
          status: 'ENABLED',
        },
      ]
    )
    equal(response.status, EHttpStatusCode.OK)
  })

  it(`${TEST_TITLE} Given normal partner api key, it should throw an error`, async () => {
    const response = await request(app)
      .get('/api/v1/partners')
      .set({ 'X-API-KEY': NORMAL_PARNER_API_KEY })

    equal(
      response.body.code,
      'PERMISSION_DENIED'
    )
    equal(response.status, EHttpStatusCode.FORBIDDEN)
  })

  it(`${TEST_TITLE} Given token of non existed user, it should throw an error`, async () => {
    const response = await request(app)
      .get('/api/v1/partners')
      .set({ 'X-API-KEY': 'NOT_EXISTED_API_KEY' })

    equal(
      response.body.code,
      'PERMISSION_DENIED'
    )
    equal(response.status, EHttpStatusCode.FORBIDDEN)
  })
})
