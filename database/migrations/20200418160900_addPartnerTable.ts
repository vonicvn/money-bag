import * as Knex from 'knex'
import { addPrimaryKey, addCreated, addModified } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('partner', table => {
    addPrimaryKey(table, 'partner_id')
    table
      .string('name', 256)
      .unique()
    table.string('ethereum_wallet', 256)
    table.string('bitcoin_wallet', 256)
    table.string('tron_wallet', 256)
    table
      .string('api_key', 256)
      .unique()
    table
      .boolean('is_admin').defaultTo(false)
    table
      .enum('status', ['ENABLED', 'DISABLED']).defaultTo('ENABLED')
    addCreated(table, knex)
  })
  await addModified('partner', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('partner')
}
