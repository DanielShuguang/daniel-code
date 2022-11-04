import { commandSerivce, CommandTypes } from '@/commands'
import { Nullable } from '@/types/common'
import { codicon } from '@/utils/codicon'
import { useMagicKeys, whenever } from '@vueuse/core'
import { debounce, throttle } from 'lodash-es'
import { Quit, WindowIsMaximised, WindowMinimise, WindowToggleMaximise } from 'runtime'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { menuCommands } from './command-handlers'
import { editMenus, fileMenus } from './data'

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

/** 初始化菜单命令和快捷键 */
export const useMenusCommandsShortcuts = () => {
  const keys = useMagicKeys()

  const menus = [...fileMenus, ...editMenus]
  menus
    .flatMap(el => [...(el.children || [])])
    .forEach(el => {
      el.shortcut &&
        whenever(keys[el.shortcut!], v => {
          if (v) {
            keyDownHandler(el.command as any)
          }
        })
    })

  const keyDownHandler = debounce((command?: keyof CommandTypes) => {
    command && commandSerivce.execCommand(command)
  }, 200)

  onMounted(() => {
    menuCommands()
  })

  onUnmounted(() => {
    commandSerivce.unregisterAll()
  })
}
