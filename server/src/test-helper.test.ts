import td from 'testdouble'
import { User, Password, knex } from './global'

beforeEach(async () => {
  await User.deleteMany({})
  await Password.deleteMany({})
})

afterEach(() => {
  td.reset()
})

after(async () => {
  await knex.destroy()
  setTimeout(() => process.exit(0), 1000)
})
