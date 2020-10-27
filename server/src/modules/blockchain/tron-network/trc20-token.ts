import { Env, EEnvKey } from '../../../global'
import { TronWebInstance } from './tron-web-instance'

export class Trc20Token {
  constructor(private tokenAddress: string, private privateKey?: string) {}

  private async getContract() {
    const tronWeb = await TronWebInstance.getByPrivateKey(this.privateKey)
    return tronWeb.contract().at(this.tokenAddress)
  }

  public async isApproved(walletAddress: string) {
    const contract = await this.getContract()
    const allowance = await contract.allowance(
      walletAddress,
      Env.get(EEnvKey.TRON_SPENDER_CONTRACT_ADDRESS)
    )
    return Number(allowance) !== 0
  }

  public async approve(_account: string, _gasPrice: number): Promise<string> {
    return 'TODO'
  }

  public async transferFrom(input: { account: string, from: string, to: string, value: string, gasPrice: string }): Promise<string> {
    return 'TODO'
  }

  async getGasLimitForApproving(account: string): Promise<number> {
    return 0
  }
}
