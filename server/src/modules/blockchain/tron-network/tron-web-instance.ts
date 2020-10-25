import TronWeb from 'tronweb'
import { Env, EEnvKey } from '../../../global'

export class TronWebInstance {
  static default = new TronWeb({
    fullHost: Env.get(EEnvKey.TRON_GRID_URL),
    privateKey: Env.get(EEnvKey.TRON_PRIVATE_KEY),
  })
}
