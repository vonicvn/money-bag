import { ITimed, ETable, createModel } from './'

export interface IPartner extends ITimed {
  partnerId: number
  name: string
  apiKey: string
  secretKey: string
  isAdmin: boolean
  status: 'ENABLED' | 'DISABLED'
}

export class Partner extends createModel<IPartner>(ETable.PARTNER) {}
