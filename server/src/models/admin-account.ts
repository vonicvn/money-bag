import { ETable, createModel } from '.'
import { EBlockchainNetwork } from './blockchain-job'

export interface IAdminAccount {
  adminAccountId: number
  currentJobId: number | null
  network: EBlockchainNetwork
  privateKey: string
  publicKey: string
}

export class AdminAccount extends createModel<IAdminAccount>(ETable.ADMIN_ACCOUNT) {}
