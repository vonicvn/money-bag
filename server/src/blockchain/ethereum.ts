import { last } from 'lodash'
import {
  Env,
  EEnvKey,
  ErrorHandler,
  Redis,
} from '../global'
import Web3 from 'web3'
import HDWalletProvider from '@truffle/hdwallet-provider'

const INFURA_URLS = JSON.parse(Env.get(EEnvKey.INFURA_URLS)) as string[]

export class Web3InstanceManager {
  private static INFURA_URL = last(INFURA_URLS)

  private static web3: Web3 = null

  static get defaultWeb3() {
    return this.web3
  }

  private static async getInfuraKey() {
    for (const infuraUrl of INFURA_URLS) {
      const used = await Redis.get(`INFURA_USED_${infuraUrl}`)
      if (!used) return infuraUrl
    }

    throw new Error('OUT_OF_INFURA_KEY')
  }

  static async initWeb3() {
    this.INFURA_URL = await this.getInfuraKey()
    this.web3 = new Web3(new HDWalletProvider(
      Env.get(EEnvKey.MNEMONIC),
      this.INFURA_URL
    // tslint:disable-next-line: no-any
    ) as any)
    await Redis.set(`INFURA_USED_${this.INFURA_URL}`, 'USED', 86400)
    console.log(`Use ${this.INFURA_URL}`)
  }

  static getWeb3ByKey(privateKeyOrMnemonic: string): Web3 {
    return new Web3(
      new HDWalletProvider(
        privateKeyOrMnemonic,
        this.INFURA_URL,
        0,
        1
      // tslint:disable-next-line: no-any
      ) as any
    )
  }

  static getWeb3ByWalletIndex(index: number) {
    return new Web3(
      new HDWalletProvider(
        Env.get(EEnvKey.MNEMONIC),
        this.INFURA_URL,
        index,
        1
      // tslint:disable-next-line: no-any
      ) as any
    )
  }
}

export enum EEthereumTransactionStatus {
  PENDING = 'PENDING',
  WAIT_FOR_MORE_COMFIRMATIONS = 'WAIT_FOR_MORE_COMFIRMATIONS',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

process.on('uncaughtException', function (error) {
  ErrorHandler.handle(error)
})
