import * as Knex from 'knex'
import { addPrimaryKey, addCreated, addModified, addCascadeForeignKey } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('hot_wallet', table => {
    addPrimaryKey(table, 'hot_wallet_id')
    addCascadeForeignKey(table, 'partner', {})
    table.string('network', 16).defaultTo('ETHEREUM')
    table.string('address', 256).nullable()
    table.unique(['partner_id', 'network'])
    addCreated(table, knex)
  })
  await addModified('hot_wallet', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('hot_wallet')
}
