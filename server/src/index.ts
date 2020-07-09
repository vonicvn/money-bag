/* istanbul ignore file */
import { Env, EEnvKey, RouteLoader, RouteFinder } from './global'
import { app } from './app'
import { registerCronJobs } from './cron'
import { AppBootstrap } from './bootstrap'

async function start() {
  await new AppBootstrap().bootstrap()
  await RouteLoader.load(app, await RouteFinder.find())
  const PORT = Env.get(EEnvKey.PORT)
  app.listen(PORT, () => console.log('Server started at port '.concat(PORT)))
  await registerCronJobs()
}

start()
