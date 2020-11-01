import { Env, EEnvKey, IBlockchainJob } from '../../../global'
import { TronWebInstance } from './tron-web-instance'

export class Trc20Token {
  constructor(private tokenAddress: string, private privateKey?: string) {}

  private async getTokenContract() {
    const tronWeb = await TronWebInstance.getByPrivateKey(this.privateKey)
    return tronWeb.contract().at(this.tokenAddress)
  }

  private async getSpenderContract() {
    const tronWeb = await TronWebInstance.getByPrivateKey(this.privateKey)
    return tronWeb.contract().at(Env.get(EEnvKey.TRON_SPENDER_CONTRACT_ADDRESS))
  }

  public async isApproved(walletAddress: string) {
    const contract = await this.getTokenContract()
    const { remaining } = await contract.allowance(
      walletAddress,
      Env.get(EEnvKey.TRON_SPENDER_CONTRACT_ADDRESS)
    ).call()
    return remaining.toNumber() !== 0
  }

  public async approve(_: IBlockchainJob): Promise<string> {
    const contract = await this.getTokenContract()
    const txID = await contract.approve(
      Env.get(EEnvKey.TRON_SPENDER_CONTRACT_ADDRESS),
      '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
    ).send({})
    return txID
  }

  public async transferFrom(input: { account: string, from: string, to: string, value: string }): Promise<string> {
    const { from, to, value } = input
    const contract = await this.getSpenderContract()
    const txID = await contract
      .transferFrom(
        this.tokenAddress,
        from,
        to,
        value
      )
      .send({})
    return txID
  }

  public async getCoinAmountForApproving(job: IBlockchainJob): Promise<string> {
    return '225610'
  }
}
