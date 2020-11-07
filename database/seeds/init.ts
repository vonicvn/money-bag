import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<void> {
  await knex('partner').insert({
    name: 'Vonic',
    ethereum_wallet: '0x2145dF5069BF17934343B6199bf6e4914989634A',
    bitcoin_wallet: '0x0',
    api_key: 'vonic_key',
    is_admin: true,
    status: 'ENABLED',
  })

  await knex('asset').insert({
    asset_id: 4,
    name: 'USDT_TRON',
    network: 'TRON',
    address: 'TENQX5zvW6znVKrMXBmcmhj48q7JAWkxzb',
    decimals: 6,
  })

  await knex('wallet').insert({
    partner_id: 1,
    address: '0xea127b4fdeff1b8d1bfe28799b0d999de00d202e',
    index: 3,
  })

  await knex('admin_account').insert([
    {
      is_active: true,
      network: 'ETHEREUM',
      private_key: 'a6fe07802bfcbfe7918254aec01c5519e3d72154b0c7bb7f5040dc337ee31499',
      public_key: '0x5D3E4F408c5052A6CA62ee0bC7b2071755B728Bf',
      partner_id: 1,
      type: 'DEPOSIT',
    },
    {
      is_active: true,
      network: 'TRON',
      private_key: '0a112de81770bc99c8c72ce58efb7b4dd90b4d341622f320308b954e022b7edd',
      public_key: 'TGRQpUFKoHiQPzKDambLQHDu5MryGBWa41',
      partner_id: 1,
      type: 'WITHDRAW',
    },
  ])

  await knex('partner_asset').insert([
    {
      partner_id: 1,
      asset_id: 1,
    },
    {
      partner_id: 1,
      asset_id: 2,
    },
    {
      partner_id: 1,
      asset_id: 4,
    },
    {
      partner_id: 1,
      asset_id: 6,
    },
  ])

  await knex('hot_wallet').insert([
    {
      network: 'ETHEREUM',
      address: '0x5D3E4F408c5052A6CA62ee0bC7b2071755B728Bf',
      partner_id: 1,
    },
    {
      network: 'TRON',
      address: 'TMR3RyfD3HhA7KaWXNaej3py9vQiLeNSdu',
      partner_id: 1,
    },
  ])
}
