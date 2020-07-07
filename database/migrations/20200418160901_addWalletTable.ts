import * as Knex from 'knex'
import { addPrimaryKey, addCreated, addModified, addCascadeForeignKey } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('wallet', table => {
    addPrimaryKey(table, 'wallet_id')
    addCascadeForeignKey(table, 'partner', {})
    table
      .string('address', 256)
      .unique()
    table
      .bigInteger('index')
      .unique()
    addCreated(table, knex)
  })
  await addModified('wallet', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('wallet')
}
