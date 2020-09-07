import { ETable, createModel, ITimed } from '.'

export interface IBlockchainJob extends ITimed {
  blockchainJobId: number
  transactionId: number
  network: EBlockchainNetwork
  hash: string
  block: number
  excutedAt: Date
  walletId: number
  adminAccountId: number
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
  SEND_APPROVE_REQUEST_ERC20 = 'SEND_APPROVE_REQUEST_ERC20',
  SEND_TRANSFER_FROM_REQUEST_ERC20 = 'SEND_TRANSFER_FROM_REQUEST_ERC20',
  TRANSFER_BITCOIN = 'TRANSFER_BITCOIN',
}

export enum EBlockchainJobStatus {
  JUST_CREATED = 'JUST_CREATED',
  PROCESSING = 'PROCESSING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  CANCELED = 'CANCELED',
  POSTPONED = 'POSTPONED',
  SKIPPED = 'SKIPPED',
}

export class BlockchainJob extends createModel<IBlockchainJob>(ETable.BLOCKCHAIN_JOB) {}
