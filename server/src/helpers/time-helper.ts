import { Constants } from '../global'

export class TimeHelper {
  static ONE_DAY = 86400000

  public static before(periodInMilis: number, from: Date | number = new Date()) {
    return new Date((new Date(from)).getTime() - periodInMilis)
  }

  public static after(periodInMilis: number, from: Date | number = new Date()) {
    return new Date((new Date(from)).getTime() + periodInMilis)
  }

  public static getDate(dateInMillisecond: number) {
    const startOfDate = Math.floor(dateInMillisecond / Constants.ONE_DAY_IN_MILLISECOND) * Constants.ONE_DAY_IN_MILLISECOND
    const endOfDate = Math.ceil(dateInMillisecond / Constants.ONE_DAY_IN_MILLISECOND) * Constants.ONE_DAY_IN_MILLISECOND
    return {
      startAt: new Date(startOfDate),
      endAt: new Date(endOfDate),
    }
  }

  public static getMonth(date: Date): { startAt: Date, endAt: Date }
  public static getMonth(year: number, month: number): { startAt: Date, endAt: Date }
  public static getMonth(arg1: number | Date, month?: number): { startAt: Date, endAt: Date } { // month: 0 - 11
    arg1 = typeof arg1 === 'number' ? arg1 : new Date(arg1).getMonth()
    return {
      startAt: new Date(arg1, month, 1),
      endAt: new Date(arg1, month + 1, 1),
    }
  }

  public static greaterThan(a: number | string | Date, b: number | string | Date) {
    return new Date(a).getTime() > new Date(b).getTime()
  }

  public static smallerThan(a: number | string | Date, b: number | string | Date) {
    return new Date(a).getTime() < new Date(b).getTime()
  }

  public static wait(millisecond: number) {
    return new Promise(resolve => setTimeout(resolve, millisecond))
  }

  public static now() {
    return Date.now()
  }
}
