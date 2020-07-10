import BigNumber from 'bignumber.js'

BigNumber.set({ EXPONENTIAL_AT: [-7, 25] })
BigNumber.config({ DECIMAL_PLACES: 5 })
BigNumber.config({ ROUNDING_MODE: 1 }) //Rounds towards zero

export class BigNumberHelper {
  // static plus(a: number, b: number) {
  //   const bigA = new BigNumber(a)
  //   const bigB = new BigNumber(b)
  //   return bigA.plus(bigB)
  // }

  // static minus(a: number, b: number) {
  //   const bigA = new BigNumber(a)
  //   const bigB = new BigNumber(b)
  //   return bigA.minus(bigB)
  // }

  // static mul(a: number, b: number) {
  //   const bigA = new BigNumber(a)
  //   const bigB = new BigNumber(b)
  //   return bigA.multipliedBy(bigB)
  // }

  static div(a: number, b: number) {
    const bigA = new BigNumber(a)
    const bigB = new BigNumber(b)
    return bigA.div(bigB)
  }
}
