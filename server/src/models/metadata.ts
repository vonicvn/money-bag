export interface ITimed {
  created: Date
  modified: Date
}

export enum ETable {
  PARTNER = 'partner',
  WALLET = 'wallet',
  TRANSACTION = 'transaction',
  ASSET = 'asset',
}
