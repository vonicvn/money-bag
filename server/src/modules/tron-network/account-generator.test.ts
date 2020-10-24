import { deepStrictEqual } from 'assert'
import { TestUtils } from '../../global'
import { AccountGenerator } from './account-generator'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`Works`, async () => {
    const account = await new AccountGenerator().getByIndex(1)
    deepStrictEqual(
      account,
      {
        privateKey: 'd4da3b52009e596222e592804482663255a18267bdb30023a9b316d611a14bd8',
        address: 'TSbCqgnJ8a81DFVKHZYgsRTZ7Gaa7wGcWQ',
      }
    )
  })
})
