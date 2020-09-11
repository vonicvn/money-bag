import { Web3InstanceManager } from '../global'
import { IBootstrapable } from './metadata'

export class InfuraBoostrap implements IBootstrapable {
  async bootstrap() {
    await Web3InstanceManager.initWeb3()
  }
}
