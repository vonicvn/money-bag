import * as Knex from 'knex'
import { addModified, addCascadeForeignKey } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('admin_account', table => {
    addCascadeForeignKey(table, 'partner', { notNullable: false, defaultValue: 1 })
  })
  await addModified('admin_account', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('admin_account', table => {
    table.dropColumn('partner_id')
  })
}
