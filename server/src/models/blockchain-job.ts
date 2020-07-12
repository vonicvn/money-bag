import { ETable, createModel } from '.'

export interface IBlockchainJob {
  blockchainJobId: number
  transactionId: number
  network: EBlockchainNetwork
  hash: string
  excutedAt: Date
  status: EBlockchainJobStatus
  type: EBlockchainJobType
}

export enum EBlockchainNetwork {
  ETHEREUM = 'ETHEREUM',
  BITCOIN = 'BITCOIN',
}

export enum EBlockchainJobType {
  TRANSFER_ALL_ETHEREUM = 'TRANSFER_ALL_ETHEREUM',
  TRANSFER_ETHEREUM_TO_SEND_APPROVE_REQUEST_ERC20 = 'TRANSFER_ETHEREUM_TO_SEND_APPROVE_REQUEST_ERC20',
  TAKE_ERC20_TOKEN_FROM_WALLET = 'TAKE_ERC20_TOKEN_FROM_WALLET',
  TRANSFER_BITCOIN = 'TRANSFER_BITCOIN',
  SEND_APPROVE_REQUEST_ERC20 = 'SEND_APPROVE_REQUEST_ERC20',
}

export enum EBlockchainJobStatus {
  JUST_CREATED = 'JUST_CREATED',
  PROCESSING = 'PROCESSING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  ASSIGNED = 'ASSIGNED',
  CANCELED = 'CANCELED',
}

export class BlockchainJob extends createModel<IBlockchainJob>(ETable.BLOCKCHAIN_JOB) {}