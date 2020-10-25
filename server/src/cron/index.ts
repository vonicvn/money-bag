/* istanbul ignore file */
import { CronJob, CronCommand } from 'cron'
import { Scanner as EthereumScanner } from './ethereum/scanner'
import { Env, EEnvKey, EBlockchainNetwork } from '../global'

function createJob(time: string, cb: CronCommand, runOnInit = false) {
  new CronJob(time, cb, null, true, null, undefined, runOnInit).start()
}

const EVERY_FIFTEEN_SECONDS = '17 * * * * *'

export async function registerCronJobs() {
  if (Env.get(EEnvKey.STOP_SCAN) === 'true') return
  // const ethereumScanner = new EthereumScanner(EBlockchainNetwork.ETHEREUM)
  // createJob(EVERY_FIFTEEN_SECONDS, () => ethereumScanner.process(), true)

  const tronScanner = new EthereumScanner(EBlockchainNetwork.TRON)
  createJob(EVERY_FIFTEEN_SECONDS, () => tronScanner.process(), true)
}
