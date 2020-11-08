import { EBlockchainNetwork, IBlockchainJob, IPartner, IAsset } from '../../global'

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

  getTransactionReceipt(hash: string): Promise<{ blockNumber: number, status: boolean } | null>

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

  getSafe(partner: IPartner): string

  getHotWallet(partnerId: number, privateKey: string): Promise<IHotWalletContract>
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

  approve(job: IBlockchainJob): Promise<string>

  isApproved(walletAddress: string): Promise<boolean>

  getCoinAmountForApproving(job: IBlockchainJob): Promise<string>
}

export interface IHotWalletContract {
  transfer(requestId: number, asset: IAsset, value: number, toAddress: string): Promise<string>
}
