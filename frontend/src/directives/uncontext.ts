import { isElement } from 'lodash-es'
import { Directive } from 'vue'

export const uncontext: Directive<HTMLElement, boolean | undefined> = {
  mounted(el, binding) {
    mountContextHandle(el, binding.value)
  },
  updated(el, binding) {
    mountContextHandle(el, binding.value)
  },
  unmounted(el) {
    el.oncontextmenu = null
  }
}

const mountContextHandle = (el: HTMLElement, value?: boolean) => {
  if (!isElement(el)) return

  el.oncontextmenu = () => {
    return !value ?? false
  }
}
