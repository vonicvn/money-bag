import { ITimed, ETable, createModel } from '.'

export interface IAsset extends ITimed {
  assetId: number
  partnerId: number
  address: string
}

export class Asset extends createModel<IAsset>(ETable.ASSET) {}
