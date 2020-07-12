import * as Knex from 'knex'
import { addPrimaryKey, addCreated, addModified, addCascadeForeignKey, addCurrencyValue } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transaction', table => {
    addPrimaryKey(table, 'transaction_id')
    addCascadeForeignKey(table, 'partner', {})
    addCascadeForeignKey(table, 'asset', {})
    table.enum('collecting_status', ['WAITING', 'PROCESSING', 'SUCCESS'])
    table.string('hash', 256)
    table.string('asset_address', 256)
    table.integer('block', 10).defaultTo(0)
    addCreated(table, knex)
  })
  await addCurrencyValue('transaction', 'value', knex)
  await addModified('transaction', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transaction')
}
