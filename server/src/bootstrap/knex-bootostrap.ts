import { exec } from 'child_process'
import { knex } from '../global'
import { IBootstrapable } from './metadata'

export class KnexBoostrap implements IBootstrapable {
  async bootstrap() {
    await this.runMigrations()
  }

  private execCommand = (cmd: string) => {
    return new Promise((resolve, reject) => {
      exec(cmd, (err, stdout) => {
        if (err) return reject(err)
        return resolve(stdout)
      })
    })
  }

  private async runMigrations() {
    try {
      const result = await knex.migrate.status({})
      if (result !== 0) return this.execCommand('cd ../database && npm run knex:latest')
    } catch (error) {
      return this.execCommand('cd ../database && npm run knex:latest')
    }
  }
}
