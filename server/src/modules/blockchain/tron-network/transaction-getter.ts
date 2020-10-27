import {
  chain,
} from 'lodash'
import {
  Fetch,
  Env,
  EEnvKey,
  EBlockchainNetwork,
  ITransactionInput,
  TronWeb,
} from '../../../global'

interface ILog {
  block_number: number
  transaction_id: string
  contract_address: string
  event_name: string
  result: {
    from: string
    to: string
    value: string
  }
}

interface IBlockResponse {
  data: ILog[]
}

export class TransactionsGetter {
  constructor(private block: number) {}

  async get(): Promise<ITransactionInput[]> {
    const url = `${Env.get(EEnvKey.TRON_GRID_URL)}/v1/blocks/${this.block}/events?only_confirmed=false`
    const response = await Fetch.get<IBlockResponse>(url)
    return chain(response.data).map(this.getTransactionInputByEvent).compact().value()
  }

  private getTransactionInputByEvent(log: ILog): ITransactionInput | null {
    if (log.event_name !== 'Transfer') return null
    return {
      block: log.block_number,
      network: EBlockchainNetwork.TRON,
      assetAddress: log.contract_address,
      hash: log.transaction_id,
      value: log.result.value,
      toAddress: TronWeb.address.fromHex(log.result.to),
    }
  }
}
