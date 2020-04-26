import { IApiError, ApiError } from '.'

export function makeSure(expression: boolean, error: IApiError) {
  if (expression) return
  throw new ApiError(error)
}

export function mustExist(value: unknown, error: IApiError) {
  if (value) return
  throw new ApiError(error)
}
