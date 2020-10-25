import { ITimed, ETable, createModel, EBlockchainNetwork } from './'

export interface IWallet extends ITimed {
  walletId: number
  partnerId: number
  address: string
  network: EBlockchainNetwork
  index: number
}

export class Wallet extends createModel<IWallet>(ETable.WALLET) {}
