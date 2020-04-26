import { defaultTo } from 'lodash'
import { CreateTableBuilder } from 'knex'
import { IAddCascadeForeignKeyOptions } from './metadata'

const FOREIGN_KEY_LENGTH_MAX = 60

const stripUndefinedKeys = (obj: {}) => Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])

const initializeOptions = (options: IAddCascadeForeignKeyOptions = {}, defaultOptions: IAddCascadeForeignKeyOptions = {}) => {
  stripUndefinedKeys(options)

  options = {
    ...defaultOptions,
    ...options,
  }

  if (options.foreignKey.length > FOREIGN_KEY_LENGTH_MAX) {
    throw new Error(`Foreign key ${options.foreignKey} is too long, please provide a shoter foreign key.`)
  }

  return options
}

export const addCascadeForeignKey = (table: CreateTableBuilder, inTable: string, options: IAddCascadeForeignKeyOptions) => {
  const foreignKeyOptions = initializeOptions(options, {
    onDelete: 'CASCADE',
    notNullable: true,
    columnName: `${inTable}_id`,
    foreignKey: `${table._tableName}_${inTable}_id_foreign`,
  })

  const { columnName, notNullable, foreignKey, onDelete, specificType, foreignColumnName } = foreignKeyOptions
  const column = specificType
      ? table.specificType(columnName, specificType).unsigned()
      : table.integer(columnName).unsigned()

  if (notNullable) column.notNullable()

  const constraint = table
    .foreign(columnName, foreignKey)
    .references(defaultTo(foreignColumnName, `${inTable}_id`))
    .inTable(inTable)
    .onUpdate('NO ACTION')
  constraint.onDelete(onDelete)
}
