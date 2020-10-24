import { isNil } from 'lodash'
import {
  Env,
  Web3InstanceManager,
  EBlockchainTransactionStatus,
} from '../../../global'

export class TransactionStatusGetter {
  async get(hash: string) {
    const receipt = await Web3InstanceManager.defaultWeb3.eth.getTransactionReceipt(hash)
    if (isNil(receipt)) return EBlockchainTransactionStatus.PENDING
    if (receipt.status) {
      const currentBlock = await Web3InstanceManager.defaultWeb3.eth.getBlockNumber()
      const shouldWaitForMoreConfirmations = currentBlock - receipt.blockNumber < Env.SAFE_NUMBER_OF_COMFIRMATION
      if (shouldWaitForMoreConfirmations) return EBlockchainTransactionStatus.WAIT_FOR_MORE_COMFIRMATIONS
      return EBlockchainTransactionStatus.SUCCESS
    }
    return EBlockchainTransactionStatus.FAILED
  }
}
