import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV !== 'local') return
  await knex('partner').insert({
    name: 'Vonic',
    ethereum_wallet: '0x2145dF5069BF17934343B6199bf6e4914989634A',
    bitcoin_wallet: '0x0',
    api_key: 'vonic_key',
    is_admin: true,
    status: 'ENABLED',
  })

  await knex('partner_asset').insert({
    partner_id: 1,
    asset_id: 1,
  })

  await knex('wallet').insert({
    partner_id: 1,
    address: '0xea127b4fdeff1b8d1bfe28799b0d999de00d202e',
    index: 3,
  })
}

export async function down(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV !== 'local') return
  await knex('partner').delete()
}
