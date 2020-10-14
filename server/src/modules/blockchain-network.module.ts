import { EBlockchainNetwork } from '../global'

export enum EBlockchainTransactionStatus {
  PENDING = 'PENDING',
  WAIT_FOR_MORE_COMFIRMATIONS = 'WAIT_FOR_MORE_COMFIRMATIONS',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

export interface IBlockchainNetwork {
  getBlockNumber(): Promise<number>

  // tslint:disable-next-line: no-any
  getTransactions(block: number): Promise<ITransactionInput[]>

  getTransactionStatus(hash: string): Promise<EBlockchainTransactionStatus>
}

export interface ITransactionInput {
  toAddress: string
  value: number
  hash: string
  assetAddress: string | null
  block: number
  network: EBlockchainNetwork
}
