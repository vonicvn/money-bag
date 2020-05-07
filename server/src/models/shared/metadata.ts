export interface ITimed {
  created: Date
  modified: Date
}

export enum ETable {
  PARTNER = 'partner',
  FACTORY_CONTRACT = 'factory_contract',
  DEPOSIT_CONTRACT = 'deposit_contract',
  TRANSACTION = 'transaction',
}
