import * as Sentry from '@sentry/node'
import { Telegram } from './telegram'

const shouldUseSentry = !['local', 'test'].includes(process.env.NODE_ENV)

if (shouldUseSentry) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    beforeSend (event) {
      const errorMessage = event.exception.values[0].value
      Telegram.send(`<b>BUG ${process.env.NODE_ENV}</b> ${errorMessage}`)
      return event
    },
  })
}

export class ErrorHandler {
  static handle(error: Error) {
    console.log(error)
    if (shouldUseSentry) return Sentry.captureException(error)
  }
}
