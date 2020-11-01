import { isNil } from 'lodash'
import { Web3InstanceManager, EBlockchainNetwork } from '../../../global'
import { AccountGenerator } from './account-generator'
import { IBlockchainNetwork } from '../metadata'
import { TransactionStatusGetter } from './transaction-status-getter'
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
    return new TransactionStatusGetter().get(hash)
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
}
