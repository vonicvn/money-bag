import { ETable, createModel } from '.'

export interface IBlockchainJob {
  blockchainJobId: number
  transactionId: number
  network: EBlockchainNetwork
  hash: string
  status: EBlockchainJobStatus
  type: EBlockchainJobType
}

export enum EBlockchainNetwork {
  ETHEREUM = 'ETHEREUM',
  BITCOIN = 'BITCOIN',
}

export enum EBlockchainJobType {
  TRANSFER_ETHEREUM = 'TRANSFER_ETHEREUM',
  TRANSFER_TOKEN = 'TRANSFER_TOKEN',
  TAKE_TOKEN_FROM_WALLET = 'TAKE_TOKEN_FROM_WALLET',
  TRANSFER_BITCOIN = 'TRANSFER_BITCOIN',
}

export enum EBlockchainJobStatus {
  JUST_CREATED = 'JUST_CREATED',
  ON_PROCESSING = 'ON_PROCESSING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  CANCELED = 'CANCELED',
}

export class BlockchainJob extends createModel<IBlockchainJob>(ETable.BLOCKCHAIN_JOB) {}
