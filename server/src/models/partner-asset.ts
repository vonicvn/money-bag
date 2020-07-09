import { ITimed, ETable, createModel } from '.'

export interface IPartnerAsset extends ITimed {
  assetId: number
  partnerId: number
}

export class PartnerAsset extends createModel<IPartnerAsset>(ETable.PARTNER_ASSET) {}
