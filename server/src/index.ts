/* istanbul ignore file */
import { Env, EEnvKey, runMigrations, RouteLoader, RouteFinder } from './global'
import { app } from './app'
import { registerCronJobs } from './cron'

async function start() {
  await runMigrations()
  await RouteLoader.load(app, await RouteFinder.find())
  const PORT = Env.get(EEnvKey.PORT)
  app.listen(PORT, () => console.log('Server started at port '.concat(PORT)))
  await registerCronJobs()
}

start()
