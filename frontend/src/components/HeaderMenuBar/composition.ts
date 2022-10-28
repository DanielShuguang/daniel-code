import { Nullable } from '@/types/common'
import { onMounted, ref } from 'vue'


/** 自适应编辑器标题位置 */
export const useMovingWindowTitle = () => {
  const titleDom = ref<Nullable<HTMLDivElement>>(null)
  const observer = ref<Nullable<ResizeObserver>>(null)
  const titleWidth = ref(0)

  onMounted(() => {
    observer.value = new ResizeObserver(() => {
      if (!titleDom.value) return

      const rect = titleDom.value.getBoundingClientRect()
      titleWidth.value = rect.width
    })
  })

  return { titleDom, titleWidth }
}
