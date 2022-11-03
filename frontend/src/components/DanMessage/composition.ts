import { commandSerivce } from '@/commands'
import { onMounted, onUnmounted, ref } from 'vue'
import { MessageOption } from './types'
import { nanoid } from 'nanoid'
import { TimeUtils } from '@/utils/time-utils'

/**
 * 推送右下角弹出消息
 * @param opt 消息设置
 */
export const messageSerivce = (opt: MessageOption) => {
  return commandSerivce.execCommand('dan-code-message', opt)
}

export const useMessageEvents = () => {
  const messageList = ref(new Map<string, MessageOption>())

  onMounted(() => {
    commandSerivce.registerCommand('dan-code-message', opt => {
      const key = nanoid()
      messageList.value.set(key, {
        ...opt,
        closable: opt.closable ?? true,
        timeout: opt.timeout ?? 3 * TimeUtils.SECOND
      })
    })
  })

  onUnmounted(() => {
    commandSerivce.unregisterCommand('dan-code-message')
  })

  return { messageList }
}
