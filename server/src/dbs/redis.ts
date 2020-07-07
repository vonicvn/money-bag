import redis from 'redis'
import { promisify } from 'util'

const redisClient = redis.createClient(process.env.REDIS_URL)

export class Redis {
  static set(key: string, value: string, seconds = 0) {
    if (seconds === 0) return promisify(redisClient.set).bind(redisClient)(key, value)
    return promisify(redisClient.setex).bind(redisClient)(key, seconds, value)
  }

  static get(key: string) {
    return promisify(redisClient.get).bind(redisClient)(key)
  }

  static del(key: string) {
    return new Promise(resolve => redisClient.del(key, resolve))
  }

  static setJson<T>(key: string, value: T, expriredTime = 0) {
    return this.set(key, JSON.stringify(value), expriredTime)
  }

  static async getJson<T>(key: string): Promise<T> {
    const value = await this.get(key)
    return JSON.parse(value)
  }

  static async flushall() {
    return promisify(redisClient.flushall).bind(redisClient)()
  }
}
