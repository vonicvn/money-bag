import * as bip39 from 'bip39'
// tslint:disable-next-line: no-require-imports
const hdKey = require('ethereumjs-wallet/hdkey')
import { Web3InstanceManager, Erc20Token, EBlockchainNetwork, Env, EEnvKey } from '../../global'
import { IBlockchainNetwork } from '../blockchain-network.module'
import { TransactionsGetter } from './transaction-getter'
import { TransactionStatusGetter } from './transaction-status-getter'

export class EthereumNetwork implements IBlockchainNetwork {
  network = EBlockchainNetwork.ETHEREUM

  getBlockNumber() {
    return Web3InstanceManager.defaultWeb3.eth.getBlockNumber()
  }

  getTransactions(block: number) {
    return new TransactionsGetter(block).get()
  }

  async getTransactionStatus(hash: string) {
    return new TransactionStatusGetter().get(hash)
  }

  getTransactionReceipt(hash: string) {
    return Web3InstanceManager.defaultWeb3.eth.getTransactionReceipt(hash)
  }

  getTokenContract(tokenAddress: string, privateKey: string) {
    const web3 = Web3InstanceManager.getWeb3ByKey(privateKey)
    return new Erc20Token(tokenAddress, web3)
  }

  async getPrivateKeyByIndex(index: number): Promise<string> {
    const seed = await bip39.mnemonicToSeed(Env.get(EEnvKey.MNEMONIC))
    const hdwallet = hdKey.fromMasterSeed(seed)
    const path = `m/44'/60'/0'/0/`
    const wallet = hdwallet.derivePath(path + index).getWallet()
    return wallet.getPrivateKey().toString('hex')
  }
}
