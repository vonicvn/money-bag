import { strictEqual } from 'assert'
import { TestUtils } from '../../global'
import { AccountGenerator } from './account-generator'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it.only(`Works`, async () => {
    const address = new AccountGenerator().generate(1)
    console.log({ address })
  })
})

// 0a112de81770bc99c8c72ce58efb7b4dd90b4d341622f320308b954e022b7edd
// d4da3b52009e596222e592804482663255a18267bdb30023a9b316d611a14bd8
