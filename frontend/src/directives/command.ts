import { commandSerivce } from '@/commands'
import { TopMenuCommands } from '@/commands/top-menu'
import { Nullable } from '@/types/common'
import { Directive } from 'vue'

export const command: Directive<HTMLElement, Nullable<keyof TopMenuCommands>> = {
  mounted(el, binding) {
    const cmd = binding.value
    if (cmd) {
      el.onclick = () => {
        commandSerivce.execCommand(cmd)
      }
    }
  },
  updated(el, binding) {
    const cmd = binding.value
    if (cmd) {
      el.onclick = () => {
        commandSerivce.execCommand(cmd)
      }
    }
  },
  unmounted(el) {
    el.onclick = null
  }
}
