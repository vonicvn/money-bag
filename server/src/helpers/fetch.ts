import { merge } from 'lodash'
import fetch, { RequestInfo, RequestInit } from 'node-fetch'
import { ErrorHandler } from './error-handler'

export class Fetch {
  private static async fetch(url: RequestInfo, init: RequestInit, retry: number) {
    for (let count = 1; count <= retry; count++) {
      try {
        const response = await fetch(url, init)
        const result = await response.json()
        return result
      } catch (error) {
        const isLastTime = count === retry
        console.log(`[FETCH_RETRY] ${url}`)
        if (!isLastTime) continue
        ErrorHandler.handle(error)
        throw new Error(`CANNOT_FETCH ${url}`)
      }
    }
  }

  static async post<T>(url: RequestInfo, init: RequestInit = undefined, retry = 1): Promise<T> {
    const options = merge({ method: 'POST', headers: { 'Content-Type': 'application/json' } }, init)
    return this.fetch(url, options, retry)
  }

  static async get<T>(url: RequestInfo, init: RequestInit = undefined, retry = 1): Promise<T> {
    return this.fetch(url, init, retry)
  }
}
