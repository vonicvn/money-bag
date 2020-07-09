import * as Knex from 'knex'
import { addCreated, addModified, addCascadeForeignKey, addPrimaryKey } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('partner_asset', table => {
    addPrimaryKey(table, 'partner_asset_id')
    addCascadeForeignKey(table, 'partner', {})
    addCascadeForeignKey(table, 'asset', {})
    table.unique(['partner_id', 'asset_id'])
    addCreated(table, knex)
  })
  await addModified('partner_asset', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('partner_asset')
}
