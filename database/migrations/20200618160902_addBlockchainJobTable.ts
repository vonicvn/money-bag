import * as Knex from 'knex'
import { addPrimaryKey, addModified, addCreated, addCascadeForeignKey } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('blockchain_job', table => {
    addPrimaryKey(table, 'blockchain_job_id')
    table.enum('status', ['JUST_CREATED', 'PROCESSING', 'FAILED', 'SUCCESS'])
    addCascadeForeignKey(table, 'transaction', {})
    table.string('type', 128)
    table.string('hash', 128)
    table.string('network', 128)
    addCreated(table, knex)
  })
  await addModified('blockchain_job', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('blockchain_job')
}
