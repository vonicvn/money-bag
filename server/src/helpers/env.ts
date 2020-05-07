export enum EEnvKey {
  DATABASE_URL = 'DATABASE_URL',
  PORT = 'PORT',
  JWT_SECRET_KEY = 'JWT_SECRET_KEY',
  NODE_ENV = 'NODE_ENV',
  ADMIN_API_KEY = 'ADMIN_API_KEY',
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
