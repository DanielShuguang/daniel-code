import { useResizeObserver, useWindowSize } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'

/** 自适应更新编辑区的宽高 */
export const useResizeEditorContainer = () => {
  const containerRect = ref({ width: '0', height: '0' })
  const classname = '.plugin-toolbar.left-bar[data-code-plugin]'

  const resize = () => {
    const dom = document.querySelector<HTMLDivElement>(classname)
    if (dom) {
      const rect = dom.getBoundingClientRect()
      const height = window.innerHeight - 30 - 22 + 'px'
      const width = window.innerWidth - rect.width - 2 + 'px'
      containerRect.value = { height, width }
    }
  }

  useResizeObserver(document.querySelector<HTMLDivElement>(classname), () => {
    resize()
  })

  const { height, width } = useWindowSize()

  watch([height, width], resize)

  onMounted(resize)

  return { containerRect }
}
