import { Contract } from 'web3-eth/node_modules/web3-eth-contract'
import {
  tokenAbi,
  spenderAbi,
} from './abis'
import {
  Env,
  EEnvKey,
  ITransaction,
  IBlockchainJob,
  EBlockchainJobType,
  BlockchainJob,
  Transaction,
} from '../global'
import { Web3InstanceManager } from './ethereum'
import BigNumber from 'bignumber.js'

export class Erc20Token {
  tokenContract: Contract

  constructor(private tokenAddress: string, private web3 = Web3InstanceManager.defaultWeb3) {
    this.tokenContract = new this.web3.eth.Contract(
      tokenAbi,
      this.tokenAddress
    )
  }

  public async getCoinAmountForApproving(job: IBlockchainJob): Promise<string> {
    const gasPrice = await Web3InstanceManager.defaultWeb3.eth.getGasPrice()
    const transaction = await Transaction.findById(job.transactionId)
    const gasLimit = await this.getGasLimitForApproving(transaction.walletAddress)
    return new BigNumber(gasLimit)
      .multipliedBy(gasPrice)
      .multipliedBy(1.3)
      .integerValue(BigNumber.ROUND_CEIL)
      .toString()
  }

  getGasLimitForApproving(account: string): Promise<number> {
    return this
      .tokenContract
      .methods
      .approve(
        Env.get(EEnvKey.SPENDER_CONTRACT_ADDRESS),
        '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
      )
      .estimateGas({ from: account })
  }

  public async transferFrom(input: { account: string, from: string, to: string, value: string, gasPrice: string }): Promise<string> {
    const { account, from, to, value, gasPrice } = input
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
        .send({ from: account, gasPrice })
        .on('transactionHash', resolve)
        .on('error', reject)
    })
  }

  public async approve(job: IBlockchainJob): Promise<string> {
    const transaction = await Transaction.findById(job.transactionId)
    const gasPrice = await this.getGasPriceForApproveRequest(transaction)
    return new Promise<string>((resolve, reject) => {
      return this
        .tokenContract
        .methods
        .approve(
          Env.get(EEnvKey.SPENDER_CONTRACT_ADDRESS),
          '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
        )
        .send({ from: transaction.walletAddress, gasPrice })
        .on('transactionHash', resolve)
        .on('error', reject)
    })
  }

  private async getGasPriceForApproveRequest(transaction: ITransaction) {
    const gasLimitForApproveRequest = await this.getGasLimitForApproving(transaction.walletAddress)
    const { hash } = await BlockchainJob.findOne({
      transactionId: transaction.transactionId,
      type: EBlockchainJobType.TRANSFER_ETHEREUM_TO_SEND_APPROVE_REQUEST_ERC20,
    })
    const { value } = await Web3InstanceManager.defaultWeb3.eth.getTransaction(hash)
    return new BigNumber(value)
      .dividedBy(gasLimitForApproveRequest)
      .integerValue(BigNumber.ROUND_DOWN)
      .toNumber()
  }

  public async isApproved(walletAddress: string) {
    const allowance = await this
      .tokenContract
      .methods
      .allowance(walletAddress, Env.get(EEnvKey.SPENDER_CONTRACT_ADDRESS))
      .call()

    return Number(allowance) !== 0
  }
}
