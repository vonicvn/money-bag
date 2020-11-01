import { Web3InstanceManager, Erc20Token, EBlockchainNetwork, exists } from '../../../global'
import { IBlockchainNetwork } from '../metadata'
import { AccountGenerator } from './account-generator'
import { TransactionsGetter } from './transaction-getter'
import { TransactionStatusGetter } from './transaction-status-getter'

export class EthereumNetwork implements IBlockchainNetwork {
  network = EBlockchainNetwork.ETHEREUM

  getTransactionInputs(blockNumber: number) {
    return new TransactionsGetter(blockNumber).get()
  }

  getBlockNumber() {
    return Web3InstanceManager.defaultWeb3.eth.getBlockNumber()
  }

  async getTransactionStatus(hash: string) {
    return new TransactionStatusGetter().get(hash)
  }

  getTransactionReceipt(hash: string) {
    return Web3InstanceManager.defaultWeb3.eth.getTransactionReceipt(hash)
  }

  getTokenContract(tokenAddress: string, privateKey?: string) {
    const web3 = exists(privateKey) ? Web3InstanceManager.getWeb3ByKey(privateKey) : Web3InstanceManager.defaultWeb3
    return new Erc20Token(tokenAddress, web3)
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
  }): Promise<string> {
    const {
      fromPrivateKey,
      fromAddress,
      toAddress,
      value,
      gasPrice,
    } = input
    const web3 = Web3InstanceManager.getWeb3ByKey(fromPrivateKey)
    return new Promise<string>((resolve, reject) => {
      web3.eth.sendTransaction({
        from: fromAddress,
        value,
        to: toAddress,
        gasPrice,
      })
        .on('transactionHash', resolve)
        .on('error', reject)
    })
  }

  getTransaction(hash: string) {
    return Web3InstanceManager.defaultWeb3.eth.getTransaction(hash)
  }
}
