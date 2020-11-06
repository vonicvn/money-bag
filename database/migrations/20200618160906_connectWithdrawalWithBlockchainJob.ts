import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('blockchain_job', table => {
    table.dropForeign(['transaction_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  //
}
