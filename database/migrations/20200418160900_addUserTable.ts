import * as Knex from 'knex'
import { addPrimaryKey, addCreated, addModified } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user', table => {
    addPrimaryKey(table, 'id')
    table
      .string('email', 256)
      .notNullable()
      .unique()
    table
      .string('name', 256)
      .notNullable()
    addCreated(table, knex)
    // indexing
    table.index(['email'])
  })
  await addModified('user', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user')
}
