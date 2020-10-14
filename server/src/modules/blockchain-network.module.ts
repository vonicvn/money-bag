import { EBlockchainNetwork } from '../global'

export interface IBlockchainNetwork {
  getBlockNumber(): Promise<number>

  // tslint:disable-next-line: no-any
  getTransactions(block: number): Promise<ITransactionInput[]>
}

export interface ITransactionInput {
  toAddress: string
  value: number
  hash: string
  assetAddress: string | null
  block: number
  network: EBlockchainNetwork
}
