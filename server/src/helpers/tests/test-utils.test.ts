import { equal } from 'assert'
import { TestUtils } from '../test-utils'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} JTestUtilsWT works`, async () => {
    equal(
      TestUtils.getTestTitle('C:/Working/ethereum_api/server/dist/helpers/tests/test-utils.test.js'),
      '/helpers/tests/test-utils'
    )

    equal(
      TestUtils.getTestTitle('C:/Working/ethereum_api/server/src/helpers/tests/test-utils.test.ts'),
      '/helpers/tests/test-utils'
    )
  })
})
