const Knex = require('knex')
const { exec } = require('child_process')

const { DATABASE_URL } = process.env

const knex = new Knex({
  client: 'postgresql',
  connection: DATABASE_URL
})

async function start() {
  try {
    await knex.raw('select 1 + 1 as result')
    console.log('Continue using current database.')
    process.exit(0)
  } catch (error) {
    console.log('Create new database...')
    exec('yarn db:reset', (err, stdout) => {
      if (err) throw err
      console.log(stdout)
      process.exit(0)
    })
  }
}

start()
