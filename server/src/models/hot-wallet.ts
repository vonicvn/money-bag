import {
  ITimed,
  ETable,
  createModel,
  EBlockchainNetwork,
} from '.'

export interface IHotWallet extends ITimed {
  hotWalletId: number
  partnerId: number
  network: EBlockchainNetwork
  address: string
}

export class HotWallet extends createModel<IHotWallet>(ETable.HOT_WALLET) {}
