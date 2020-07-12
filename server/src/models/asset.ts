import { ITimed, ETable, createModel, EBlockchainNetwork } from '.'

export interface IAsset extends ITimed {
  assetId: number
  name: string
  address: string
  decimals: number
  network: EBlockchainNetwork
}

export enum EDefaultAssetId {
  ETH = 1,
  USDT = 2,
  BTC = 3,
}

export class Asset extends createModel<IAsset>(ETable.ASSET) {}
