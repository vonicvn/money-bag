import td from 'testdouble'
import { knex, Partner, Wallet, Asset, Transaction, Redis } from './global'
import { RedisBoostrap } from './bootstrap'

beforeEach(async () => {
  await Partner.deleteMany({})
  await Wallet.deleteMany({})

  // keep 3 initial asset
  await Asset.deleteMany({}, builder => builder.whereNotIn('assetId', [1, 2, 3]))
  await Transaction.deleteMany({})
  await Redis.flushall()
  await new RedisBoostrap().bootstrap()
})

afterEach(() => {
  td.reset()
})

after(async () => {
  await knex.destroy()
  setTimeout(() => process.exit(0), 1000)
})
