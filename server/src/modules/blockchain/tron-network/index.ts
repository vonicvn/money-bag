import TronWeb from 'tronweb'
import * as bip39 from 'bip39'
// tslint:disable-next-line: no-require-imports
const { hdkey } = require('ethereumjs-wallet')

import { Web3InstanceManager, Erc20Token, EBlockchainNetwork, Env, EEnvKey, exists } from '../../../global'
import { AccountGenerator } from './account-generator'
import { IBlockchainNetwork } from '../metadata'
import { TransactionStatusGetter } from './transaction-status-getter'
import { TransactionsGetter } from './transaction-getter'

export class TronNetwork implements IBlockchainNetwork {
  static tronWeb = new TronWeb({
    fullHost: Env.get(EEnvKey.TRON_GRID_URL),
    privateKey: Env.get(EEnvKey.TRON_PRIVATE_KEY),
  })

  network = EBlockchainNetwork.TRON

  getTransactionInputs(blockNumber: number) {
    return new TransactionsGetter(blockNumber).get()
  }

  async getBlockNumber() {
    const currentBlock = await TronNetwork.tronWeb.trx.getCurrentBlock()
    return currentBlock.block_header.raw_data.number
  }

  async getTransactionStatus(hash: string) {
    return new TransactionStatusGetter().get(hash)
  }

  getTransactionReceipt(hash: string) {
    return Web3InstanceManager.defaultWeb3.eth.getTransactionReceipt(hash)
  }

  getTokenContract(tokenAddress: string, privateKey: string | null) {
    const web3 = exists(privateKey) ? Web3InstanceManager.getWeb3ByKey(privateKey) : Web3InstanceManager.defaultWeb3
    return new Erc20Token(tokenAddress, web3)
  }

  async getKeysByIndex(index: number) {
    const seed = await bip39.mnemonicToSeed(Env.get(EEnvKey.MNEMONIC))
    const hdwallet = hdkey.fromMasterSeed(seed)
    const path = `m/44'/60'/0'/0/`
    const wallet = hdwallet.derivePath(path + index).getWallet()
    const publicKey = '0x' + wallet.getAddress().toString('hex')
    const privateKey = wallet.getPrivateKey().toString('hex')
    return { publicKey, privateKey }
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

  generateAccount(index: number) {
    return new AccountGenerator().getByIndex(index)
  }
}
