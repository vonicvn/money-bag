import { ITimed, ETable, createModel } from './'

export interface IWallet extends ITimed {
  walletId: number
  partnerId: number
  address: string
  index: number
}

export class Wallet extends createModel<IWallet>(ETable.WALLET) {}
