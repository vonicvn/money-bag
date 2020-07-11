import { isNil } from 'lodash'
import {
  ITransaction,
  EDefaultWalletId,
  BlockchainJob,
  EBlockchainJobType,
  EBlockchainJobStatus,
  EBlockchainNetwork,
  IBlockchainJob,
  exists,
} from '../../global'

export interface IBlockchainJobInput {
  blockchainJob?: IBlockchainJob
  transaction?: ITransaction
}

export function createJob({ blockchainJob, transaction }: IBlockchainJobInput) {
  if (exists(transaction) && isNil(blockchainJob)) return createJobFromTransaction(transaction)
  if (exists(blockchainJob) && isNil(transaction)) return createJobFromJob(transaction)
  throw new Error('INVALID_JOB_INPUT')
}

export async function createJobFromJob(blockchainJob: IBlockchainJob) {
  if (blockchainJob.type === EBlockchainJobType.TRANSFER_ETHEREUM_TO_SEND_APPROVE_REQUEST_ERC20) {
    await BlockchainJob.create({
      transactionId: blockchainJob.transactionId,
      network: blockchainJob.network,
      status: EBlockchainJobStatus.JUST_CREATED,
      type: EBlockchainJobType.SEND_APPROVE_REQUEST_ERC20,
    })
  }
  if (blockchainJob.type === EBlockchainJobType.SEND_APPROVE_REQUEST_ERC20) {
    await BlockchainJob.create({
      transactionId: blockchainJob.transactionId,
      network: blockchainJob.network,
      status: EBlockchainJobStatus.JUST_CREATED,
      type: EBlockchainJobType.TAKE_ERC20_TOKEN_FROM_WALLET,
    })
  }
  return
}

export function createJobFromTransaction(transaction: ITransaction) {
  if (transaction.assetId === EDefaultWalletId.ETH) return collectEthereum(transaction)
  if (transaction.assetId === EDefaultWalletId.BTC) return collectBitcoin(transaction)
  return collectEthereumToken(transaction)
}

export function collectEthereum(transaction: ITransaction) {
  return BlockchainJob.create({
    transactionId: transaction.transactionId,
    network: EBlockchainNetwork.ETHEREUM,
    status: EBlockchainJobStatus.JUST_CREATED,
    type: EBlockchainJobType.TRANSFER_ALL_ETHEREUM,
  })
}

export function collectBitcoin(transaction: ITransaction) {
  return BlockchainJob.create({
    transactionId: transaction.transactionId,
    network: EBlockchainNetwork.BITCOIN,
    status: EBlockchainJobStatus.JUST_CREATED,
    type: EBlockchainJobType.TRANSFER_BITCOIN,
  })
}

export async function collectEthereumToken(transaction: ITransaction) {
  // check should send approval request
  if (await getShouldSendApprovalRequest()) {
    return collectErc20ForNewWallet(transaction)
  }
  return collectErc20ForOldWallet(transaction)
}

export async function getShouldSendApprovalRequest() {
  // todo: implement it
  return true
}

export async function collectErc20ForNewWallet(transaction: ITransaction) {
  await BlockchainJob.create({
    transactionId: transaction.transactionId,
    network: EBlockchainNetwork.ETHEREUM,
    status: EBlockchainJobStatus.JUST_CREATED,
    type: EBlockchainJobType.TRANSFER_ETHEREUM_TO_SEND_APPROVE_REQUEST_ERC20,
  })
}

export async function collectErc20ForOldWallet(transaction: ITransaction) {
  await BlockchainJob.create({
    transactionId: transaction.transactionId,
    network: EBlockchainNetwork.ETHEREUM,
    status: EBlockchainJobStatus.JUST_CREATED,
    type: EBlockchainJobType.TAKE_ERC20_TOKEN_FROM_WALLET,
  })
}
