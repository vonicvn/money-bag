import * as Knex from 'knex'
import { addPrimaryKey } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('admin_account', table => {
    addPrimaryKey(table, 'admin_account_id')
    table.string('type', 128)
    table.boolean('is_active').defaultTo(false)
    table.string('private_key', 256)
    table.string('public_key', 256)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('admin_account')
}
