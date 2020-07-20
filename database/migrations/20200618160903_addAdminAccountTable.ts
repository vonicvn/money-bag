import * as Knex from 'knex'
import { addPrimaryKey, addCascadeForeignKey } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('admin_account', table => {
    addPrimaryKey(table, 'admin_account_id')
    addCascadeForeignKey(table, 'blockchain_job', {
      columnName: 'current_job_id',
      notNullable: false,
    })
    table.string('type', 128)
    table.string('private_key', 256)
    table.string('public_key', 256)
  })

  await knex.schema.alterTable('blockchain_job', table => {
    addCascadeForeignKey(table, 'admin_account', { notNullable: false })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('admin_account')
}
