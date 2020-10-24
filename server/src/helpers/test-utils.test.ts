import { strictEqual } from 'assert'
import { TestUtils } from './test-utils'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} JTestUtilsWT works`, async () => {
    strictEqual(
      TestUtils.getTestTitle('C:/Working/money_bag/server/dist/helpers/tests/test-utils.test.js'),
      '/helpers/tests/test-utils'
    )

    strictEqual(
      TestUtils.getTestTitle('C:/Working/money_bag/server/src/helpers/tests/test-utils.test.ts'),
      '/helpers/tests/test-utils'
    )
  })
})
