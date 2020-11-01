import { EBlockchainNetwork, IBlockchainJob } from '../../global'

export enum EBlockchainTransactionStatus {
  PENDING = 'PENDING',
  WAIT_FOR_MORE_COMFIRMATIONS = 'WAIT_FOR_MORE_COMFIRMATIONS',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

export interface IBlockchainNetwork {
  network: EBlockchainNetwork

  getTransactionInputs(blockNumber: number): Promise<ITransactionInput[]>

  getBlockNumber(): Promise<number>

  getTransactionStatus(hash: string): Promise<EBlockchainTransactionStatus>

  getTransactionReceipt(hash: string): Promise<{ blockNumber: number, status: boolean }>

  getTokenContract(tokenAddress: string, privateKey?: string): IRCToken

  getKeysByIndex(index: number): Promise<{ privateKey: string,  publicKey: string }>

  getGasPrice(): Promise<string>

  getTransactionCount(address: string): Promise<number>

  sendTransaction(input: {
    fromPrivateKey: string,
    fromAddress: string
    toAddress: string
    value: string
  }): Promise<string>

  getTransaction(hash: string): Promise<{ value: string }>
}

export interface ITransactionInput {
  toAddress: string
  value: string
  hash: string
  assetAddress: string | null
  block: number
  network: EBlockchainNetwork
}

interface IRCToken {
  transferFrom(input: { account: string, from: string, to: string, value: string, gasPrice: string }): Promise<string>

  approve(account: string, gasPrice: number): Promise<string>

  isApproved(walletAddress: string): Promise<boolean>

  getGasLimitForApproving(walletAddress: string): Promise<number>

  getCoinAmountForApproving(job: IBlockchainJob): Promise<string>
}
