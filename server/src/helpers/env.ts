export enum EEnvKey {
  DATABASE_URL = 'DATABASE_URL',
  PORT = 'PORT',
  NODE_ENV = 'NODE_ENV',
  MNEMONIC = 'MNEMONIC',
  INFURA_URL = 'INFURA_URL',
  SAFE_NUMBER_OF_COMFIRMATION = 'SAFE_NUMBER_OF_COMFIRMATION',
}

export enum EEnviroment {
  LOCAL = 'local',
  TEST = 'test',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export class Env {
  static get(key: EEnvKey) {
    return process.env[key]
  }
}
