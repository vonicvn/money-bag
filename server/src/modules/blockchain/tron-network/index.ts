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

  getTransactionReceipt(hash: string) {
    return Web3InstanceManager.defaultWeb3.eth.getTransactionReceipt(hash)
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

  sendTransaction(input: {
    fromPrivateKey: string
    fromAddress: string
    toAddress: string
    value: string
    gasPrice: string
    nonce: number
  }): Promise<string> {
    const {
      fromPrivateKey,
      fromAddress,
      toAddress,
      value,
      gasPrice,
      nonce,
    } = input
    const web3 = Web3InstanceManager.getWeb3ByKey(fromPrivateKey)
    return new Promise<string>((resolve, reject) => {
      web3.eth.sendTransaction({
        from: fromAddress,
        value,
        to: toAddress,
        gasPrice,
        nonce,
      })
        .on('transactionHash', resolve)
        .on('error', reject)
    })
  }

  getTransaction(hash: string) {
    return Web3InstanceManager.defaultWeb3.eth.getTransaction(hash)
  }
}
