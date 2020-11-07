import { isNil } from 'lodash'
import { Web3InstanceManager, EBlockchainNetwork, Env, IPartner } from '../../../global'
import { AccountGenerator } from './account-generator'
import { EBlockchainTransactionStatus, IBlockchainNetwork } from '../metadata'
import { TransactionsGetter } from './transaction-getter'
import { TronWebInstance } from './tron-web-instance'
import { Trc20Token } from './trc20-token'

export class TronNetwork implements IBlockchainNetwork {
  network = EBlockchainNetwork.TRON

  getTransactionInputs(blockNumber: number) {
    return new TransactionsGetter(blockNumber).get()
  }

  async getBlockNumber() {
    const currentBlock = await TronWebInstance.default.trx.getCurrentBlock()
    return currentBlock.block_header.raw_data.number
  }

  async getTransactionStatus(hash: string) {
    const receipt = await this.getTransactionReceipt(hash)
    if (isNil(receipt)) return EBlockchainTransactionStatus.PENDING
    if (receipt.status) {
      const currentBlock = await this.getBlockNumber()
      const shouldWaitForMoreConfirmations = currentBlock - receipt.blockNumber < Env.SAFE_NUMBER_OF_COMFIRMATION
      if (shouldWaitForMoreConfirmations) return EBlockchainTransactionStatus.WAIT_FOR_MORE_COMFIRMATIONS
      return EBlockchainTransactionStatus.SUCCESS
    }
    return EBlockchainTransactionStatus.FAILED
  }

  async getTransactionReceipt(hash: string) {
    const response = await TronWebInstance.default.trx.getTransactionInfo(hash)
    if (isNil(response.receipt)) return null
    const isSuccess = isNil(response.receipt.result) || response.receipt.result === 'SUCCESS'
    return isSuccess ?
      { status: true, blockNumber: response.blockNumber } :
      { status: false, blockNumber: response.blockNumber }
  }

  getTokenContract(tokenAddress: string, privateKey?: string) {
    return new Trc20Token(tokenAddress, privateKey)
  }

  async getKeysByIndex(index: number) {
    return new AccountGenerator().getByIndex(index)
  }

  async getTransactionCount(address: string) {
    return Web3InstanceManager.defaultWeb3.eth.getTransactionCount(address)
  }

  getGasPrice() {
    return Web3InstanceManager.defaultWeb3.eth.getGasPrice()
  }

  async sendTransaction(input: {
    fromPrivateKey: string
    fromAddress: string
    toAddress: string
    value: string
  }): Promise<string> {
    const {
      fromPrivateKey,
      fromAddress,
      toAddress,
      value,
    } = input
    const tronWeb = TronWebInstance.getByPrivateKey(fromPrivateKey)
    const transaction = await tronWeb.transactionBuilder.sendTrx(toAddress, value, fromAddress)
    const signed = await tronWeb.trx.sign(
      transaction,
      fromPrivateKey
    )
    await tronWeb.trx.sendRawTransaction(signed)
    return transaction.txID
  }

  getTransaction(hash: string) {
    return Web3InstanceManager.defaultWeb3.eth.getTransaction(hash)
  }

  getSafe(partner: IPartner) { return partner.tronWallet }

  async getHotWallet(partnerId: number) {
    return { async transfer() { return '' } }
  }
}
