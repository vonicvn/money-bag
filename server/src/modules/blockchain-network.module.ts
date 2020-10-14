import { EBlockchainNetwork } from '../global'

export enum EBlockchainTransactionStatus {
  PENDING = 'PENDING',
  WAIT_FOR_MORE_COMFIRMATIONS = 'WAIT_FOR_MORE_COMFIRMATIONS',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

export interface IBlockchainNetwork {
  network: EBlockchainNetwork

  getBlockNumber(): Promise<number>

  getTransactions(block: number): Promise<ITransactionInput[]>

  getTransactionStatus(hash: string): Promise<EBlockchainTransactionStatus>

  getTransactionReceipt(hash: string): Promise<{ blockNumber: number, status: boolean }>

  getTokenContract(tokenAddress: string, privateKey: string): IRCToken

  getKeysByIndex(index: number): Promise<{ privateKey: string,  publicKey: string }>

  getGasPrice(): Promise<string>

  getTransactionCount(address: string): Promise<number>

  sendTransaction(input: {
    fromPrivateKey: string,
    fromAddress: string
    toAddress: string
    value: string
    gasPrice: string
    nonce: number
  }): Promise<string>
}

export interface ITransactionInput {
  toAddress: string
  value: number
  hash: string
  assetAddress: string | null
  block: number
  network: EBlockchainNetwork
}

interface IRCToken {
  transferFrom(input: { account: string, from: string, to: string, value: string, gasPrice: string }): Promise<string>

  approve(account: string, gasPrice: number): Promise<string>

  isApproved(walletAddress: string): Promise<boolean>
}
