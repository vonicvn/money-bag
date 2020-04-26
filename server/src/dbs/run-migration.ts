/* istanbul ignore file */
import { exec } from 'child_process'
import { knex } from './knex'

const execCommand = (cmd: string) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) return reject(err)
      return resolve(stdout)
    })
  })
}

export async function runMigrations() {
  try {
    const result = await knex.migrate.status({})
    if (result !== 0) return execCommand('cd ../database && npm run knex:latest')
  } catch (error) {
    return execCommand('cd ../database && npm run knex:latest')
  }
}
