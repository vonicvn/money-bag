import * as Knex from 'knex'
import {
  addPrimaryKey,
  addCreated,
  addModified,
  addCascadeForeignKey,
  addCurrencyValue,
} from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('withdrawal', table => {
    addPrimaryKey(table, 'withdrawal_id')
    addCascadeForeignKey(table, 'partner', {})
    addCascadeForeignKey(table, 'asset', {})
    table
      .enum('status', ['WAITING', 'PROCESSING', 'SUCCESS', 'CANCELED', 'FAILED'])
      .defaultTo('WAITING')
      .notNullable()
    table.string('hash', 256)
    table.bigInteger('request_id')
    table.unique(['partner_id', 'request_id'])
    addCreated(table, knex)
  })
  await addCurrencyValue('withdrawal', 'value', knex)
  await addModified('withdrawal', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('withdrawal')
}
