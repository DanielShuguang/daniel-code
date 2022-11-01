import { isString } from 'lodash-es'
import { LogError, LogInfo, LogWarning } from 'runtime'

/**
 * 日志输出
 */
export const logger = {
  warn(message: string | Error) {
    console.warn(message)
    LogWarning(getErrorMsg(message))
  },
  error(message: string | Error) {
    console.error(message)
    LogError(getErrorMsg(message))
  },
  info(message: string | Error) {
    console.log(message)
    LogInfo(getErrorMsg(message))
  }
}

const getErrorMsg = (err: Error | string) => {
  if (isString(err)) {
    return err
  }
  return err.stack || err.message
}
