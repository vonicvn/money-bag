import * as Knex from 'knex'
import { addPrimaryKey, addCreated, addModified, addCascadeForeignKey } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('factory_contract', table => {
    addPrimaryKey(table, 'factory_contract_id')
    addCascadeForeignKey(table, 'partner', {})
    table
      .string('address', 256)
      .unique()
    table
      .enum('status', ['ENABLED', 'DISABLED'])
      .defaultTo('ENABLED')
    table
      .enum('network', ['MAINNET', 'RINKEBY'])
      .defaultTo('MAINNET')
    table
      .string('infura_key', 256)
      .unique()
    addCreated(table, knex)
  })
  await addModified('factory_contract', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('factory_contract')
}
