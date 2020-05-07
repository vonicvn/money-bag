import td from 'testdouble'
import { knex, Partner } from './global'

beforeEach(async () => {
  await Partner.deleteMany({})
})

afterEach(() => {
  td.reset()
})

after(async () => {
  await knex.destroy()
  setTimeout(() => process.exit(0), 1000)
})
