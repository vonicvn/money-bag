import td from 'testdouble'
import { knex, Partner, Wallet, Token, Transaction, Redis } from './global'

beforeEach(async () => {
  await Partner.deleteMany({})
  await Wallet.deleteMany({})
  await Token.deleteMany({})
  await Transaction.deleteMany({})
  await Redis.flushall()
})

afterEach(() => {
  td.reset()
})

after(async () => {
  await knex.destroy()
  setTimeout(() => process.exit(0), 1000)
})
