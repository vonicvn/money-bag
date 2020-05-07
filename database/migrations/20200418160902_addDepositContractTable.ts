import * as Knex from 'knex'
import { addPrimaryKey, addCreated, addModified, addCascadeForeignKey } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('deposit_contract', table => {
    addPrimaryKey(table, 'deposit_contract_id')
    addCascadeForeignKey(table, 'factory_contract', {})
    table
      .string('address', 256)
      .unique()
    table
      .integer('block', 10).defaultTo(0)
    addCreated(table, knex)
  })
  await addModified('deposit_contract', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('deposit_contract')
}
