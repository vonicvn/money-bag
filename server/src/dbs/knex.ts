import pg from 'pg'
import Knex from 'knex'
import { Env, EEnvKey } from '../global'
import { wrapIdentifier, postProcessResponse } from './transform'

const PG_DECIMAL_OID = 1700
const PG_BIGINT_OID = 20

pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat)
pg.types.setTypeParser(PG_BIGINT_OID, parseInt)

export const knex = Knex({
  client: 'postgresql',
  connection: Env.get(EEnvKey.DATABASE_URL),
  pool: {
    min: 1,
    max: 20,
  },
  wrapIdentifier,
  postProcessResponse,
  debug: false,
})
