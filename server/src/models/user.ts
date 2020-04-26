import { ITimed, ETable, createModel } from './shared'

export interface IUser extends ITimed {
  id: number
  email: string
  name: string
}

export class User extends createModel<IUser>(ETable.USER) {}
