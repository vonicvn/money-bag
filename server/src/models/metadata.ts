export interface ITimed {
  created: Date
  modified: Date
}

export enum ETable {
  PARTNER = 'partner',
  WALLET = 'wallet',
  TRANSACTION = 'transaction',
  ASSET = 'asset',
  PARTNER_ASSET = 'partner_asset',
  BLOCKCHAIN_JOB = 'blockchain_job',
  ADMIN_ACCOUNT = 'admin_account',
  WITHDRAWAL = 'withdrawal',
}
