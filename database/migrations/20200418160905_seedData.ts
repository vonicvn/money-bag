import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV !== 'local') return
  await knex('partner').insert([
    {
      name: 'Vonic',
      ethereum_wallet: '0x0',
      bitcoin_wallet: '0x0',
      api_key: 'vonic_key',
      is_admin: true,
      status: 'ENABLED',
    },
    {
      name: 'Random partner',
      ethereum_wallet: '0x0',
      bitcoin_wallet: '0x0',
      api_key: 'random_key',
      is_admin: false,
      status: 'ENABLED',
    },
  ])
}

export async function down(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV !== 'local') return
  await knex('partner').delete()
}
