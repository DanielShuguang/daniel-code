import { commandSerivce, CommandTypes } from '@/commands'
import { Nullable } from '@/types/common'
import { isElement } from 'lodash-es'
import { Directive } from 'vue'

export const command: Directive<HTMLElement, Nullable<keyof CommandTypes>> = {
  mounted(el, binding) {
    mountCommander(el, binding.value)
  },
  updated(el, binding) {
    mountCommander(el, binding.value)
  },
  unmounted(el) {
    el.onclick = null
  }
}

const mountCommander = (el: HTMLElement, cmd: Nullable<keyof CommandTypes>) => {
  if (!isElement(el) || !cmd) return

  el.onclick = () => {
    commandSerivce.execCommand(cmd)
  }
}
