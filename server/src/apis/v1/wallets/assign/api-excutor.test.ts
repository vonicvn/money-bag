import {
  TestUtils,
  Value,
  Wallet,
  Partner,
  EBlockchainNetwork,
} from '../../../../global'
import { ApiExcutor } from './api-excutor'
import { deepStrictEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(async () => {
    await Partner.create({
      partnerId: 1,
    })
    await Wallet.createMany([
      {
        walletId: 1,
        address: '0x1',
        index: 0,
      },
      {
        walletId: 2,
        address: '0x2',
        index: 1,
      },
      {
        walletId: 3,
        address: '0x3',
        index: 2,
      },
    ])
  })

  it(`${TEST_TITLE} ApiExcutor works`, async () => {
    await new ApiExcutor().excute(
      { quantity: 2, partnerId: 1, network: EBlockchainNetwork.ETHEREUM },
      Value.NO_MATTER
    )
    const wallets = await Wallet.findAll({}, builder => {
      return builder.select('walletId', 'partnerId').orderBy('walletId')
    })
    deepStrictEqual(wallets, [
      { walletId: 1, partnerId: 1 },
      { walletId: 2, partnerId: 1 },
      { walletId: 3, partnerId: null },
    ])
  })
})
