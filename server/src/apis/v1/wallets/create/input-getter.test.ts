import { TestUtils } from '../../../../global'
import { InputGetter } from './input-getter'
import { deepStrictEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} InputGetter works`, async () => {
    deepStrictEqual(
      new InputGetter().getInput({
        body: { quantity: '2 ', network: 'TRON' },
      }),
      { quantity: 2, network: 'TRON' }
    )
  })
})
