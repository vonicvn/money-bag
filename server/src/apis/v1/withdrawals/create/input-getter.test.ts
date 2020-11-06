import { TestUtils } from '../../../../global'
import { InputGetter } from './input-getter'
import { deepStrictEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it('Works', async () => {
    deepStrictEqual(
      new InputGetter().getInput({
        body: { requestId: ' 1 ', value: 100, assetId: 1 },
      }),
      { requestId: '1', value: 100, assetId: 1 }
    )
  })
})
