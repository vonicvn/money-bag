const Knex = require('knex')
const { exec } = require('child_process')

const { DATABASE_URL } = process.env

const DATABASE_NAME = DATABASE_URL.split('/')[3]

const TEMP_DATABASE_URL = DATABASE_URL.replace(DATABASE_NAME, 'postgres')

const tempKnex = new Knex({
  client: 'postgresql',
  connection: TEMP_DATABASE_URL
})

const knex = new Knex({
  client: 'postgresql',
  connection: DATABASE_URL
})

async function start() {
  try {
    await tempKnex.raw(`
      SELECT 
        pg_terminate_backend(pid) 
      FROM 
        pg_stat_activity 
      WHERE 
        -- don't kill my own connection!
        pid <> pg_backend_pid()
        -- don't kill the connections to other databases
        AND datname = '${DATABASE_NAME}'
    `)
    await tempKnex.raw(`DROP DATABASE ${DATABASE_NAME}`)
  } catch (error) {
    console.log(error.message)
    console.log('Continue...')
  } finally {
    await tempKnex.raw(`CREATE DATABASE ${DATABASE_NAME}`)
    const output = await execCommand('npm run knex:latest')
    console.log(output)
  }
  process.exit(0)
}

function execCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) return reject(err)
      return resolve(stdout)
    })
  })
}

start()
