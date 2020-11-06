import { TestUtils } from '../../../../global'
import { deepStrictEqual } from 'assert'
import { InputGetter } from './input-getter'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} InputGetter works`, async () => {
    deepStrictEqual(
      new InputGetter().getInput({
        params: {
          withdrawalId: ' 100 ',
        },
      }),
      { withdrawalId: 100 }
    )
  })
})
