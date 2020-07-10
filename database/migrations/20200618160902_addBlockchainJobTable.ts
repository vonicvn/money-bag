import * as Knex from 'knex'
import { addPrimaryKey } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('blockchain_job', table => {
    addPrimaryKey(table, 'blockchain_job_id')
    table.enum('status', ['JUST_CREATED', 'ON_PROCESSING', 'FAILED', 'DONE'])
    table.string('type', 128)
    table.string('hash', 128)
    table.string('network', 128)
    table.string('input', 512)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('blockchain_job')
}
