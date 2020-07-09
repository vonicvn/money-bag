import * as Knex from 'knex'
import { addPrimaryKey, addCreated, addModified } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('asset', table => {
    addPrimaryKey(table, 'asset_id')
    table.string('address', 256).nullable()
    table.string('name', 16).notNullable()
    table.string('network', 16).notNullable().defaultTo('ETHEREUM')
    table.integer('decimals', 8).notNullable().defaultTo(18)
    addCreated(table, knex)
  })
  await addModified('asset', knex)

  await knex('asset').insert([
    { asset_id: 1, name: 'ETH', network: 'ETHEREUM', decimals: 18 },
    { asset_id: 2, name: 'USDT', network: 'ETHEREUM', decimals: 6, address: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
    { asset_id: 3, name: 'BTC', network: 'BITCOIN', decimals: 9 },
  ])
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('asset')
}
