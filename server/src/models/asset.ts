import { ITimed, ETable, createModel } from '.'

export interface IAsset extends ITimed {
  assetId: number
  name: string
  address: string
  network: 'ETHEREUM' | 'BITCOIN'
}

export class Asset extends createModel<IAsset>(ETable.ASSET) {}
