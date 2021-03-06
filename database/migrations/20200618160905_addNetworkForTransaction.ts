import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transaction', table => {
    table.string('network', 16).defaultTo('ETHEREUM')
  })
  await knex('transaction').update({ network: 'ETHEREUM' })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transaction', table => {
    table.dropColumn('network')
  })
}
