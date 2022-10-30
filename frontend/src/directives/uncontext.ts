import { Directive } from 'vue'

export const uncontext: Directive<HTMLElement, boolean | undefined> = {
  mounted(el, binding) {
    el.oncontextmenu = () => {
      return !binding.value ?? false
    }
  },
  updated(el, binding) {
    el.oncontextmenu = () => {
      return !binding.value ?? false
    }
  },
  unmounted(el) {
    el.oncontextmenu = null
  }
}
