import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('admin_account', table => {
    table.enum('type', ['WITHDRAW', 'DEPOSIT']).defaultTo('DEPOSIT')
    table.unique(['private_key', 'network'])
  })
}

export async function down(knex: Knex): Promise<void> {
  //
}
