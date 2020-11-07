import { ETable, createModel } from '.'
import { EBlockchainNetwork } from './blockchain-job'

export enum EAdminAccountType {
  WITHDRAW = 'WITHDRAW',
  DEPOSIT = 'DEPOSIT',
}

export interface IAdminAccount {
  adminAccountId: number
  network: EBlockchainNetwork
  isActive: boolean
  partnerId: number
  privateKey: string
  publicKey: string
  type: EAdminAccountType
}

export class AdminAccount extends createModel<IAdminAccount>(ETable.ADMIN_ACCOUNT) {}
