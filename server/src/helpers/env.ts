import {
  defaultTo,
} from 'lodash'

export enum EEnvKey {
  DATABASE_URL = 'DATABASE_URL',
  PORT = 'PORT',
  NODE_ENV = 'NODE_ENV',
  MNEMONIC = 'MNEMONIC',
  INFURA_URLS = 'INFURA_URLS',
  SAFE_NUMBER_OF_COMFIRMATION = 'SAFE_NUMBER_OF_COMFIRMATION',
  SPENDER_CONTRACT_ADDRESS = 'SPENDER_CONTRACT_ADDRESS',
  ETHERSCAN_API_URL = 'ETHERSCAN_API_URL',
  ETHERSCAN_API_KEY = 'ETHERSCAN_API_KEY',
  TRON_GRID_URL = 'TRON_GRID_URL',
  TRON_PRIVATE_KEY = 'TRON_PRIVATE_KEY',
  STOP_SCAN = 'STOP_SCAN',
}

export enum EEnviroment {
  LOCAL = 'local',
  TEST = 'test',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export class Env {
  static SAFE_NUMBER_OF_COMFIRMATION = Env.getSafeNumberOfConfirmation()

  static get(key: EEnvKey) {
    return process.env[key]
  }

  static getSafeNumberOfConfirmation() {
    return Number(defaultTo(Env.get(EEnvKey.SAFE_NUMBER_OF_COMFIRMATION), 5))
  }
}
