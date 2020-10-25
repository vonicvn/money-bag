/* istanbul ignore file */
import { CronJob, CronCommand } from 'cron'
import { Scanner as EthereumScanner } from './ethereum/scanner'
import { Env, EEnvKey, EBlockchainNetwork } from '../global'

function createJob(time: string, cb: CronCommand, runOnInit = false) {
  new CronJob(time, cb, null, true, null, undefined, runOnInit).start()
}

export async function registerCronJobs() {
  if (Env.get(EEnvKey.STOP_SCAN) === 'true') return
  const ethereumScanner = new EthereumScanner(EBlockchainNetwork.ETHEREUM)
  createJob('17 * * * * *', () => ethereumScanner.process(), true)

  const tronScanner = new EthereumScanner(EBlockchainNetwork.TRON)
  createJob('/10 * * * * *', () => tronScanner.process(), true)
}
