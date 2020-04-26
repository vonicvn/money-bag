import * as dotenv from 'dotenv'
import * as path from 'path'
import { Config } from 'knex'

dotenv.load({ path: process.env.DOTENV_CONFIG_PATH })

const databaseDirectory = __dirname
const migrationDirectory = path.join(databaseDirectory, 'migrations')
const seedsDirectory = path.join(databaseDirectory, 'seeds')

const knexConfig: Config = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 1,
    max: 1,
  },
  migrations: {
    directory: migrationDirectory,
    tableName: 'knex_migrations_new',
  },
  seeds: {
    directory: seedsDirectory,
  },
}

module.exports = {
  test: knexConfig,
  development: knexConfig,
  local: knexConfig,
  production: knexConfig,
  migration: knexConfig,
  staging: knexConfig,
}
