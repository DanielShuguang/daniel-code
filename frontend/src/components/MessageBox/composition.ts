import { commandSerivce, useCommandService } from '@/commands'
import { MessageOption } from './types'
import { nanoid } from 'nanoid'
import { TimeUtils } from '@/utils/time-utils'
import { useMessageStore } from '@/store'

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
  const messageStore = useMessageStore()

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

  useCommandService('dan-code-message', opt => {
    const key = nanoid()
    const cfg: Config = {
      ...opt,
      key,
      closable: opt.closable ?? true,
      timeout: opt.timeout ?? 3 * TimeUtils.Second,
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

  watch(messageList, list => {
    messageStore.$state.messageCount = list.length
  })

  return { messageList, showMessageList }
}
