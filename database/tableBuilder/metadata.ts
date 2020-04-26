declare module 'knex' {
  // tslint:disable-next-line:interface-name
  interface CreateTableBuilder extends TableBuilder {
    _tableName: string
  }
}

export interface IAddFlagOptions {
  defaultTo: boolean
}

export type IAddCascadeForeignKeyOptions = Partial<{
  onDelete: IForeignKeyReferentialAction
  notNullable: boolean
  columnName: string
  foreignKey: string
  specificType: string
  foreignColumnName: string
}>

export type IForeignKeyReferentialAction = 'CASCADE' | 'NO ACTION' | 'RESTRICT' | 'SET NULL' | 'SET DEFAULT'
