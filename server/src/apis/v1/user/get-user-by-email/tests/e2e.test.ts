import { omit } from 'lodash'
import express from 'express'
import request from 'supertest'
import { deepEqual, equal } from 'assert'
import { TestUtils, RouteLoader, User, JWT, EHttpStatusCode } from '../../../../../global'
import { Route } from '../route'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  const app = express()

  beforeEach(TEST_TITLE, async () => {
    await RouteLoader.load(app, [new Route()])

    await User.createMany([
      { id: 1, name: 'Testing Account 1', email: 'account1@gmail.com' },
      { id: 2, name: 'Testing Account 2', email: 'account2@gmail.com' },
    ])
  })

  it(`${TEST_TITLE} Can get user by email`, async () => {
    const response = await request(app)
      .get('/api/v1/users')
      .query({ email: 'account2@gmail.com' })
      .set({ Authorization: `Bearer ${await JWT.createToken({ id: 1 })}` })

    deepEqual(
      omit(response.body, 'created', 'modified'),
      { id: 2, name: 'Testing Account 2', email: 'account2@gmail.com' }
    )
    equal(response.status, EHttpStatusCode.OK)
  })

  it(`${TEST_TITLE} Given invalid token, it should throw an error`, async () => {
    const response = await request(app)
      .get('/api/v1/users')
      .query({ email: 'account2@gmail.com' })
      .set({ Authorization: `Bearer a.b.c` })

    equal(
      response.body.code,
      'PERMISSION_DENIED'
    )
    equal(response.status, EHttpStatusCode.FORBIDDEN)
  })

  it(`${TEST_TITLE} Given token of non existed user, it should throw an error`, async () => {
    const response = await request(app)
      .get('/api/v1/users')
      .query({ email: 'account2@gmail.com' })
      .set({ Authorization: `Bearer ${await JWT.createToken({ id: 0 })}` })

    equal(
      response.body.code,
      'PERMISSION_DENIED'
    )
    equal(response.status, EHttpStatusCode.FORBIDDEN)
  })
})
