/* istanbul ignore file */
/* tslint:disable */
import { isObject, isNumber } from 'lodash'
const decamelize = require('decamelize')
const camelcaseKeys = require('camelcase-keys')

type UnknowObject = { [key: string]: unknown; }

interface IQueryContext {
  keepOriginal: boolean
}

export function wrapIdentifier(value: string, origImpl: any, queryContext: IQueryContext) {
  if (queryContext && queryContext.keepOriginal) return origImpl(value)
  const isJoinQuery = value.startsWith('_')
  const newValue = (isJoinQuery ? '_' : '') + decamelize(value)
  return origImpl(newValue)
}

export function postProcessResponse(result: any, queryContext: IQueryContext): any {
  if (result && result.rows) return postProcessResponse(result.rows, queryContext)
  if (queryContext && queryContext.keepOriginal) return result
  if(!result) return result

  if (Array.isArray(result)) {
    const isInsertResult = result.length === 1 && isNumber(result[0])
    if (isInsertResult) return result[0]
    return result.map((row) => {
      if (isObject(row)) return camelcaseKeys(row as UnknowObject, { deep: true })
      return row
    })
  }
  const isUpdateResult = isNumber(result)
  if (isUpdateResult) return result
  return camelcaseKeys(result, { deep: true })
}
