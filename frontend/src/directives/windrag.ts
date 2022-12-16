import { Nullable } from '@/types/common'
import { isElement } from 'lodash-es'
import { Directive } from 'vue'

// 设置是否可拖拽窗口
export const windrag: Directive<HTMLElement, Nullable<boolean>> = {
  mounted(el, binding) {
    changeDragState(el, binding.value)
  },
  updated(el, binding) {
    changeDragState(el, binding.value)
  }
}

const changeDragState = (el: HTMLElement, value: Nullable<boolean>) => {
  if (!isElement(el)) return

  const isDrag = value ?? true
  if (isDrag) {
    el.style.setProperty('--wails-draggable', 'drag')
  } else {
    el.style.setProperty('--wails-draggable', 'no-drag')
  }
}
