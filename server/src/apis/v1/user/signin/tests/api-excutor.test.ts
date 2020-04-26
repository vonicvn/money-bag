import td from 'testdouble'
import { TestUtils, JWT, deepOmit, TestUserContextBuilder } from '../../../../../global'
import { ApiExcutor } from '../service'
import { deepEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(async () => {
    await TestUserContextBuilder.create({ email: 'user@gmail.com' })
    td.replace(JWT, 'createToken', () => Promise.resolve('SAMPLE_TOKEN'))
  })

  it(`${TEST_TITLE} Can login`, async () => {
    const result = await new ApiExcutor().excute({ email: 'user@gmail.com', password: 'doesnt-matter' })
    deepEqual(
      deepOmit(result, ['created', 'modified', 'name']),
      { access_token: 'SAMPLE_TOKEN' }
    )
  })
})
