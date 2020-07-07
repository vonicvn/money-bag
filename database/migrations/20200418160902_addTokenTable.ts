import * as Knex from 'knex'
import { addPrimaryKey, addCreated, addModified, addCascadeForeignKey } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('token', table => {
    addPrimaryKey(table, 'token_id')
    addCascadeForeignKey(table, 'partner', {})
    table
      .string('address', 256)
      .notNullable()
    table.unique(['address', 'partner_id'])
    addCreated(table, knex)
  })
  await addModified('token', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('token')
}
