import * as Knex from 'knex'
import { addModified, addCascadeForeignKey, addCreated } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('password', table => {
    addCascadeForeignKey(table, 'user', { foreignColumnName: 'id', columnName: 'id' })
    table.primary(['id'])
    table
      .string('password_hash', 256)
      .notNullable()
    addCreated(table, knex)
  })
  await addModified('password', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('password')
}
