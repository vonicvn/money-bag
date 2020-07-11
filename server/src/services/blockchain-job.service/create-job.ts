import {
  ITransaction,
  EDefaultWalletId,
  BlockchainJob,
  EBlockchainJobType,
  EBlockchainJobStatus,
  EBlockchainNetwork,
} from '../../global'
import { func } from 'testdouble'

export function createJobs(transacion: ITransaction) {
  if (transacion.assetId === EDefaultWalletId.ETH) return collectEthereum(transacion)
  if (transacion.assetId === EDefaultWalletId.BTC) return collectBitcoin(transacion)
  return collectEthereumToken(transacion)
}

export function collectEthereum(transacion: ITransaction) {
  return BlockchainJob.create({
    transactionId: transacion.transactionId,
    network: EBlockchainNetwork.ETHEREUM,
    status: EBlockchainJobStatus.JUST_CREATED,
    type: EBlockchainJobType.TRANSFER_ETHEREUM,
  })
}

export function collectBitcoin(transacion: ITransaction) {
  return BlockchainJob.create({
    transactionId: transacion.transactionId,
    network: EBlockchainNetwork.BITCOIN,
    status: EBlockchainJobStatus.JUST_CREATED,
    type: EBlockchainJobType.TRANSFER_BITCOIN,
  })
}

export function collectEthereumToken(transacion: ITransaction) {
  // check should send approve
}
