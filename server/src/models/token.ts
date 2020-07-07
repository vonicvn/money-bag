import { ITimed, ETable, createModel } from '.'

export interface IToken extends ITimed {
  tokenId: number
  partnerId: number
  address: string
}

export class Token extends createModel<IToken>(ETable.TOKEN) {}
