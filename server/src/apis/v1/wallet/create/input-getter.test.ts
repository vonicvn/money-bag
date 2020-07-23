import { TestUtils } from '../../../../global'
import { InputGetter } from './input-getter'
import { deepEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} InputGetter works`, async () => {
    deepEqual(
      new InputGetter().getInput({
        body: { quantity: '2 ' },
      }),
      { quantity: 2 }
    )
  })
})
