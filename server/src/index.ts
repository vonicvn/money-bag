/* istanbul ignore file */
import { Env, EEnvKey, runMigrations, RouteLoader, RouteFinder } from './global'
import { app } from './app'
import { registerCronJobs } from './cron'

async function start() {
  await runMigrations()
  await RouteLoader.load(app, await RouteFinder.find())
  app.listen(Env.get(EEnvKey.PORT), () => console.log('Server started.'))
  await registerCronJobs()
}

start()
