import BigNumber from 'bignumber.js'

// tslint:disable-next-line: no-any
BigNumber.set({ EXPONENTIAL_AT: [-7, 35] })
BigNumber.config({ DECIMAL_PLACES: 5 })
BigNumber.config({ ROUNDING_MODE: 1 }) //Rounds towards zero

export const Configs = {
  DEFAULT_TOKEN_EXPIRED_TIME: 864000, // 1 day
}
