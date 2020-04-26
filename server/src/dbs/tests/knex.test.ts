import { deepEqual } from 'assert'
import { TestUtils, knex } from '../../global'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} Can connect database`, async () => {
    deepEqual(
      await knex.raw(`SELECT 1 + 1 as result`),
      [{ result: 2 }]
    )
  })
})
