import { TestUtils } from '../../../../global'
import { InputGetter } from './input-getter'
import { deepEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} InputGetter works`, async () => {
    deepEqual(
      new InputGetter().getInput({
        body: { partnerId: ' 1', quantity: '2 ' },
      }),
      { partnerId: 1, quantity: 2 }
    )
  })
})
