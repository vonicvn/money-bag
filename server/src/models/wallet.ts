import { ITimed, ETable, createModel } from './'

export interface IWallet extends ITimed {
  walletId: number
  partnerId: number
  address: string
  index: number
}

export enum EDefaultWalletId {
  ETH = 1,
  USDT = 2,
  BTC = 3,
}

export class Wallet extends createModel<IWallet>(ETable.WALLET) {}
