import * as Knex from 'knex'
import { addPrimaryKey, addCreated, addModified } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('asset', table => {
    addPrimaryKey(table, 'asset_id')
    table
      .string('address', 256)
      .notNullable()
    addCreated(table, knex)
  })
  await addModified('asset', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('asset')
}
