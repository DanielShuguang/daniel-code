import { commandSerivce } from '@/commands'
import { Nullable } from '@/types/common'
import { codicon } from '@/utils/codicon'
import { Quit, WindowIsMaximised, WindowMinimise, WindowToggleMaximise } from 'runtime'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { menuCommands } from './command-handlers'

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

export const useWindowControllers = () => {
  const isMaximise = ref(false)

  const controls = [
    { icon: codicon('chrome-minimize'), type: 'mini' },
    { icon: codicon('chrome-maximize'), type: 'max' },
    { icon: codicon('chrome-restore'), type: 'max' },
    { icon: codicon('chrome-close'), type: 'close' }
  ]

  const correctControls = computed(() => {
    if (isMaximise.value) {
      return controls.filter(c => !c.icon.includes('maximize'))
    }
    return controls.filter(c => !c.icon.includes('restore'))
  })

  const windowControl = async (type: string) => {
    switch (type) {
      case 'mini':
        return WindowMinimise()
      case 'max':
        WindowToggleMaximise()
        isMaximise.value = !isMaximise.value
        return
      case 'close':
        return Quit()
      default:
        break
    }
  }

  onMounted(async () => {
    isMaximise.value = await WindowIsMaximised()
  })

  return { controls, isMaximise, correctControls, windowControl }
}

export const useMenusCommands = () => {
  onMounted(() => {
    menuCommands()
  })

  onUnmounted(() => {
    commandSerivce.unregisterAll()
  })
}
