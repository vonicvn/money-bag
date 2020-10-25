import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('wallet', table => {
    table.string('network', 16).defaultTo('ETHEREUM')
    table.dropUnique(['index'])
    table.unique(['network', 'index'])
  })
  await knex('wallet').update({ network: 'ETHEREUM' })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('wallet', table => {
    table.dropColumn('network')
  })
}
