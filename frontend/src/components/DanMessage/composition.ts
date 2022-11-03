import { commandSerivce } from '@/commands'
import { onMounted, onUnmounted, ref } from 'vue'
import { MessageItem, MessageOption } from './types'
import { nanoid } from 'nanoid'
import { TimeUtils } from '@/utils/time-utils'

/**
 * 推送右下角弹出消息
 * @param opt 消息设置
 */
export const messageSerivce = (opt: MessageOption, callback?: (reason: string) => void) => {
  return commandSerivce.execCommand('dan-code-message', opt, callback)
}

export const useMessageEvents = () => {
  const messageList = ref(new Map<string, MessageItem>())

  onMounted(() => {
    commandSerivce.registerCommand('dan-code-message', (opt, callback) => {
      const key = nanoid()
      messageList.value.set(key, {
        ...opt,
        closable: opt.closable ?? true,
        timeout: opt.timeout ?? 3 * TimeUtils.SECOND,
        callback
      })
    })
  })

  onUnmounted(() => {
    commandSerivce.unregisterCommand('dan-code-message')
  })

  return { messageList }
}
