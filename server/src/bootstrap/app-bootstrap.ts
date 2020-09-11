import { IBootstrapable } from './metadata'
import { KnexBoostrap } from './knex-bootostrap'
import { RedisBoostrap } from './redis-bootstrap'
import { InfuraBoostrap } from './infura-bootstrap'

export class AppBootstrap implements IBootstrapable {
  async bootstrap() {
    await new KnexBoostrap().bootstrap()
    await new RedisBoostrap().bootstrap()
    await new InfuraBoostrap().bootstrap()
  }
}
