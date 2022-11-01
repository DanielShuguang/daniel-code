import { Nullable } from '@/types/common'
import { Directive } from 'vue'

// 设置是否可拖拽窗口
export const windrag: Directive<HTMLElement, Nullable<boolean>> = {
  mounted(el, binding) {
    const isDrag = binding.value ?? true
    if (isDrag) {
      el.style.setProperty('--wails-draggable', 'drag')
    } else {
      el.style.setProperty('--wails-draggable', 'no-drag')
    }
  },
  updated(el, binding) {
    const isDrag = binding.value ?? true
    if (isDrag) {
      el.style.setProperty('--wails-draggable', 'drag')
    } else {
      el.style.setProperty('--wails-draggable', 'no-drag')
    }
  }
}
