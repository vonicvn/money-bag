import {
  defaultTo
} from 'lodash'
import { TimeHelper } from './time-helper'

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
}

export enum EEnviroment {
  LOCAL = 'local',
  TEST = 'test',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export class Env {
  static INFURA_URL = Env.getInfuraURL()

  static get(key: EEnvKey) {
    return process.env[key]
  }

  static get SAFE_NUMBER_OF_COMFIRMATION() {
    return Number(defaultTo(Env.get(EEnvKey.SAFE_NUMBER_OF_COMFIRMATION), 5))
  }

  protected static getInfuraURL() {
    const urls = JSON.parse(this.get(EEnvKey.INFURA_URLS)) as string[]
    const timeForEachUrl = TimeHelper.ONE_DAY / urls.length
    return urls[Math.floor((TimeHelper.now() % TimeHelper.ONE_DAY) / timeForEachUrl)]
  }
}
