import td from 'testdouble'
import {
  deepStrictEqual,
  strictEqual,
} from 'assert'
import {
  TestUtils,
  Fetch,
} from '../../../global'
import { TronNetwork } from '.'
import { TronWebInstance } from './tron-web-instance'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  const tronNetwork = new TronNetwork()

  it('#getBlockNumber', async () => {
    td.replace(TronWebInstance.default.trx, 'getCurrentBlock', () => ({
      block_header: { raw_data: { number: 100 } },
    }))
    strictEqual(
      await tronNetwork.getBlockNumber(),
      100
    )
  })

  it('#getTransactionInputs', async () => {
    td.replace(Fetch, 'get', () => ({
      data: [
        {
          block_number: 8949006,
          contract_address: 'TENQX5zvW6znVKrMXBmcmhj48q7JAWkxzb',
          event_name: 'Transfer',
          result: {
            from: '0xb650da2eb384f914a5736e35ab354cfd1fa2be5c',
            to: '0x44c7aff2b0a4a467230ed9a684d906defa820604',
            value: '10000000000',
          },
          result_type: { from: 'address', to: 'address', value: 'uint256' },
          transaction_id: '75165ac00c2f6ed4b5b84915a2e90110f7fde1bd37714e732be5a5ea135f0737',
        },
        {
          block_number: 8949006,
          contract_address: 'TENQX5zvW6znVKrMXBmcmhj48q7JAWkxzb',
          event_name: 'NOT_Transfer',
          result: {
            from: '0xb650da2eb384f914a5736e35ab354cfd1fa2be5c',
            to: '0x44c7aff2b0a4a467230ed9a684d906defa820604',
            value: '10000000000',
          },
          result_type: { from: 'address', to: 'address', value: 'uint256' },
          transaction_id: '75165ac00c2f6ed4b5b84915a2e90110f7fde1bd37714e732be5a5ea135f0737',
        },
      ],
    }))
    const response = await tronNetwork.getTransactionInputs(8949006)
    deepStrictEqual(
      response,
      [
        {
          block: 8949006,
          network: 'TRON',
          assetAddress: 'TENQX5zvW6znVKrMXBmcmhj48q7JAWkxzb',
          hash: '75165ac00c2f6ed4b5b84915a2e90110f7fde1bd37714e732be5a5ea135f0737',
          value: '10000000000',
          toAddress: 'TGEtAcvFMXy1AqnuxU99LCnESsBC2FjzSK',
        },
      ]

    )
  })
})
