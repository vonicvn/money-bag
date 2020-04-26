import { omit } from 'lodash'
import { deepEqual } from 'assert'
import { TestUtils, TestUserContextBuilder } from '../../../../../global'
import { ApiExcutor } from '../service'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(async () => {
    await TestUserContextBuilder.create({ id: 1, email: 'example@gmail.com' })
  })

  it(`${TEST_TITLE} ApiExcutor works with not-followed users`, async () => {
    const response = await new ApiExcutor().excute({ email: 'example@gmail.com' })
    deepEqual(
      omit(response, ['created', 'modified']),
      { id: 1, email: 'example@gmail.com', name: 'Testing Account' }
    )
  })
})
