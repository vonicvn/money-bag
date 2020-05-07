import * as Knex from 'knex'
import { addPrimaryKey, addCreated, addModified, addCascadeForeignKey, addCurrencyValue } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transaction', table => {
    addPrimaryKey(table, 'transaction_id')
    addCascadeForeignKey(table, 'deposit_contract', {})
    table.string('hash', 256).unique()
    table.integer('block', 10).defaultTo(0)
    addCreated(table, knex)
  })
  await addCurrencyValue('transaction', 'value', knex)
  await addModified('transaction', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transaction')
}
