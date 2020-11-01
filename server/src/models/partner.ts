import { ITimed, ETable, createModel } from './'

export interface IPartner extends ITimed {
  partnerId: number
  name: string
  apiKey: string
  isAdmin: boolean
  ethereumWallet?: string
  bitcoinWallet?: string
  tronWallet?: string
  status: 'ENABLED' | 'DISABLED'
}

export class Partner extends createModel<IPartner>(ETable.PARTNER) {}
