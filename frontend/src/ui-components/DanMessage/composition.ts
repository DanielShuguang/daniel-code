import { commandSerivce } from '@/commands'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { MessageOption } from './types'
import { nanoid } from 'nanoid'
import { TimeUtils } from '@/utils/time-utils'

interface Config extends MessageOption {
  key: string
  show: boolean
}

/**
 * 推送右下角弹出消息
 * @param opt 消息设置
 */
export const messageSerivce = (opt: MessageOption) => {
  return commandSerivce.execCommand('dan-code-message', opt)
}

export const useMessageEvents = () => {
  const messageList = ref<Config[]>([])
  const showMessageList = computed(() => {
    const showList: Config[] = []
    messageList.value.forEach(val => {
      if (val.show) {
        showList.push(val)
      }
    })
    return showList
  })

  onMounted(() => {
    commandSerivce.registerCommand('dan-code-message', opt => {
      const key = nanoid()
      const cfg: Config = {
        ...opt,
        key,
        closable: opt.closable ?? true,
        timeout: opt.timeout ?? 3 * TimeUtils.SECOND,
        show: true
      }
      messageList.value.push(cfg)
      if (cfg.timeout) {
        setTimeout(() => {
          const target = messageList.value.find(el => el.key === key)
          if (target) {
            target.show = false
          }
        }, cfg.timeout)
      }
    })

    for (let j = 0; j < 5; j++) {
      let str = ''
      for (let i = 0; i < 50; i++) {
        str += `message-test${j} `
      }
      messageSerivce({ type: 'info', message: str, timeout: 0 })
    }
  })

  onUnmounted(() => {
    commandSerivce.unregisterCommand('dan-code-message')
  })

  return { messageList, showMessageList }
}
