import { TestUtils } from '../../../../../global'
import { InputGetter } from '../service'
import { deepEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} InputGetter works`, async () => {
    deepEqual(
      new InputGetter().getInput({
        params: { factoryContractId: ' 1' },
        query: { fromDepositContractId: '  2 ' },
      }),
      { factoryContractId: 1, fromDepositContractId: 2 }
    )

    deepEqual(
      new InputGetter().getInput({
        params: { factoryContractId: ' 1' },
        query: {},
      }),
      { factoryContractId: 1, fromDepositContractId: 0 }
    )
  })
})