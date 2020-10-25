import { TestUtils } from '../../../../global'
import { deepStrictEqual } from 'assert'
import { InputGetter } from './input-getter'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} InputGetter works`, async () => {
    deepStrictEqual(
      new InputGetter().getInput({
        query: {
          page: '1',
          limit: ' 2',
          fromWalletId: '3 ',
        },
      }),
      { page: 1, limit: 2, fromWalletId: 3 }
    )

    deepStrictEqual(
      new InputGetter().getInput({ query: {} }),
      { page: 1, limit: 10, fromWalletId: 1 }
    )
  })
})
