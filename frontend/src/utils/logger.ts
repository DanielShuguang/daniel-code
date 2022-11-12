import { messageSerivce } from '@/components/MessageBox/composition'
import { isString } from 'lodash-es'

/**
 * 日志输出
 * @param notify 是否需要弹窗提示，默认为 true
 */
export const logger = {
  warn(message: string | Error, notify = true) {
    console.warn(message)
    notify &&
      messageSerivce({
        type: 'warn',
        message: getErrorMsg(message)
      })
  },
  error(message: string | Error, notify = true) {
    console.error(message)
    notify &&
      messageSerivce({
        type: 'error',
        message: getErrorMsg(message)
      })
  },
  info(message: string | Error, notify = true) {
    console.log(message)
    notify &&
      messageSerivce({
        type: 'info',
        message: getErrorMsg(message)
      })
  }
}

const getErrorMsg = (err: Error | string) => {
  if (isString(err)) {
    return err
  }
  return err.stack || err.message
}
