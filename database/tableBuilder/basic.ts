import * as Knex from 'knex'

export const addCreated = (table: Knex.CreateTableBuilder, knex: Knex): void => {
  table
    .dateTime('created')
    .notNullable()
    .defaultTo(knex.raw('current_timestamp'))
}

export const addModified = async (tableName: string, knex: Knex) => {
  await knex.schema.alterTable(tableName, table => {
    table
      .dateTime('modified')
      .notNullable()
      .defaultTo(knex.raw('current_timestamp'))
  })
  const sql = `CREATE TRIGGER ${tableName}_modified
  BEFORE UPDATE ON "${tableName}"
  FOR EACH ROW
  EXECUTE PROCEDURE on_update_timestamp();`
  return knex.raw(sql)
}

export const addPrimaryKey = (table: Knex.CreateTableBuilder, name: string): void => {
  table
    .increments(name)
    .unsigned()
    .primary()
}
