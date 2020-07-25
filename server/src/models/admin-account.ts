import { ETable, createModel } from '.'
import { EBlockchainNetwork } from './blockchain-job'

export interface IAdminAccount {
  adminAccountId: number
  network: EBlockchainNetwork
  isActive: boolean
  partnerId: number
  privateKey: string
  publicKey: string
}

export class AdminAccount extends createModel<IAdminAccount>(ETable.ADMIN_ACCOUNT) {}
