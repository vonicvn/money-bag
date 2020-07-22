import Web3 from 'web3'
import { Contract } from 'web3-eth/node_modules/web3-eth-contract'
import { tokenAbi, spenderAbi } from './abis'
import BigNumber from 'bignumber.js'
import {
  Env,
  EEnvKey,
} from '../global'
import { web3 as defaultWeb3 } from './ethereum'

export class Erc20Token {
  tokenContract: Contract

  constructor(private tokenAddress: string, private web3 = defaultWeb3) {
    this.tokenContract = new this.web3.eth.Contract(
      tokenAbi,
      this.tokenAddress
    )
  }

  getGasLimitForApproving(account: string): Promise<number> {
    return this
      .tokenContract
      .methods
      .apprrove()
      .estimateGas({ from: account })
  }

  public async transferFrom(account: string, from: string, to: string, value: string): Promise<string> {
    const gasPrice = await this.web3.eth.getGasPrice()
    const nonce = await this.web3.eth.getTransactionCount(account)
    const spender = new this.web3.eth.Contract(
      spenderAbi,
      Env.get(EEnvKey.SPENDER_CONTRACT_ADDRESS)
    )
    return new Promise<string>((resolve, reject) => {
      return spender
        .methods
        .transferFrom(
          this.tokenAddress,
          from,
          to,
          value
        )
        .send({ from: account, gasPrice, nonce })
        .on('transactionHash', resolve)
        .on('error', reject)
    })
  }

  public async approve(account: string): Promise<string> {
    const balance = await this.web3.eth.getBalance(account)
    const gasLimit = await this.getGasLimitForApproving(account)
    const gasPrice = new BigNumber(balance).dividedBy(gasLimit).toNumber()
    const nonce = await this.web3.eth.getTransactionCount(account)
    return new Promise<string>((resolve, reject) => {
      return this
        .tokenContract
        .methods
        .apprrove(
          Env.get(EEnvKey.SPENDER_CONTRACT_ADDRESS),
          '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
        )
        .send({ from: account, gasPrice, nonce })
        .on('transactionHash', resolve)
        .on('error', reject)
    })
  }

  public async isApproved(walletAddress: string) {
    const allowance = await this
      .tokenContract
      .methods
      .allowance(walletAddress, Env.get(EEnvKey.SPENDER_CONTRACT_ADDRESS))
      .call()

    return allowance !== 0
  }
}
