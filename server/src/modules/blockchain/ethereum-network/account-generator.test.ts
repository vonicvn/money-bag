import { deepStrictEqual } from 'assert'
import { TestUtils } from '../../../global'
import { AccountGenerator } from './account-generator'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`Works`, async () => {
    const account = await new AccountGenerator().getByIndex(1)
    deepStrictEqual(
      account,
      {
        privateKey: 'a6fe07802bfcbfe7918254aec01c5519e3d72154b0c7bb7f5040dc337ee31499',
        publicKey: '0x5d3e4f408c5052a6ca62ee0bc7b2071755b728bf',
      }
    )
  })
})
