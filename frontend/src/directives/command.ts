import { execCommand } from '@/commands'
import { TopMenuCommands } from '@/commands/top-menu'
import { Definable } from '@/types/common'
import { Directive } from 'vue'

export const command: Directive<HTMLElement, Definable<keyof TopMenuCommands>> = {
  mounted(el, binding) {
    const cmd = binding.value
    if (cmd) {
      el.onclick = () => {
        execCommand(cmd)
      }
    }
  },
  updated(el, binding) {
    const cmd = binding.value
    if (cmd) {
      el.onclick = () => {
        execCommand(cmd)
      }
    }
  },
  unmounted(el) {
    el.onclick = null
  }
}
