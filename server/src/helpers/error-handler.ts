import { isNil } from 'lodash'
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
    if (!shouldUseSentry) return

    const lastOccurenceTime = this.errorMessageLastOccurence.get(error.message)
    const COOL_DOWN_TIME = 10 * 60 * 1000 // 10 minutes

    if (isNil(lastOccurenceTime) || lastOccurenceTime < Date.now() - COOL_DOWN_TIME) {
      this.errorMessageLastOccurence.set(error.message, Date.now())
      return Sentry.captureException(error)
    }
  }

  private static errorMessageLastOccurence = new Map<string, number>()
}
