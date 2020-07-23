import { merge } from 'lodash'
import fetch, { RequestInfo, RequestInit } from 'node-fetch'
import { ErrorHandler } from './error-handler'

export class Fetch {
  private static async fetch(url: RequestInfo, init: RequestInit) {
    try {
      const response = await fetch(url, init)
      return await response.json()
    } catch (error) {
      ErrorHandler.handle(error)
      throw new Error(`CANNOT_FETCH ${url}`)
    }
  }

  static async post<T>(url: RequestInfo, init: RequestInit = undefined): Promise<T> {
    return this.fetch(url, merge({ method: 'POST', headers: { 'Content-Type': 'application/json' } }, init))
  }

  static async get<T>(url: RequestInfo, init: RequestInit = undefined): Promise<T> {
    return this.fetch(url, init)
  }
}
