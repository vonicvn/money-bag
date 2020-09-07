/* istanbul ignore file */
import { CronJob, CronCommand } from 'cron'
import { Scanner as EthereumScanner } from './ethereum/scanner'

function createJob(time: string, cb: CronCommand, runOnInit = false) {
  new CronJob(time, cb, null, true, null, undefined, runOnInit).start()
}

const EVERY_FIFTEEN_SECONDS = '17 * * * * *'

export async function registerCronJobs() {
  const ethereumScanner = new EthereumScanner()
  createJob(EVERY_FIFTEEN_SECONDS, () => ethereumScanner.process(), true)
}
