export enum EEnvKey {
  DATABASE_URL = 'DATABASE_URL',
  PORT = 'PORT',
  NODE_ENV = 'NODE_ENV',
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
