import { useBaseStore, useFileSystemStore, usePluginStore, useProjectSystemStore } from '@/store'
import { FileInfo, GenericContainer } from '@/types/file-system'
import { codeLocalStorage } from '@/utils/storage'
import { isFileInfo } from '@/utils/type-check'
import { onBeforeMount, onMounted, watch } from 'vue'
import { plugins } from '../LeftToolbar/data'

/** 响应窗口失焦、聚焦状态 */
export const useWindowsFocusHandler = () => {
  const baseStore = useBaseStore()

  onBeforeMount(() => {
    window.onblur = () => {
      baseStore.$patch({ isWindowActive: false })
    }
    window.onfocus = () => {
      baseStore.$patch({ isWindowActive: true })
    }
  })
}

/** 初始化编辑器之前的使用状态 */
export const useInitEditorInfo = () => {
  const pluginStore = usePluginStore()
  const projectStore = useProjectSystemStore()
  const fileStore = useFileSystemStore()

  /** 初始化上一次激活插件 */
  const initPlugin = () => {
    const activePlugin = codeLocalStorage.get('active-plugin')
    pluginStore.changeActivePlugin(activePlugin ?? plugins[0])
  }
  /** 初始化上一次打开的项目 */
  const initProject = () => {
    const activeProject = codeLocalStorage.get('active-project')
    if (activeProject) {
      projectStore.changeCurrentProject(activeProject)
    }
    initFile(!!activeProject)
  }
  /**
   * 初始化上一次打开的文件
   * @param isProject 上次开启时是否为项目工程
   */
  const initFile = (isProject: boolean) => {
    const openedEditors = codeLocalStorage.get('opened-editors')

    const editors: Array<FileInfo | GenericContainer> = []
    const shouldOpen = openedEditors?.every(ed => {
      if (isFileInfo(ed) && ed.isProject && !isProject) {
        return false
      }
      editors.push(ed)
      return true
    })
    if (shouldOpen) {
      fileStore.$patch(state => state.openEditors.push(...editors))
      const activeFile = codeLocalStorage.get('active-editor')
      activeFile && fileStore.changeCurrentEditor(activeFile)
    }
  }

  onMounted(() => {
    initProject()
    initPlugin()
  })
}

/** 初始化编辑器主题 */
export const useInitEditorTheme = () => {
  const baseStore = useBaseStore()

  onBeforeMount(() => {
    const theme = codeLocalStorage.get('editor-theme')
    baseStore.changeTheme(theme ?? 'default-dark')
  })
}

export const useUpdateEditorsStorage = () => {
  const fileStore = useFileSystemStore()

  watch(
    () => fileStore.openEditors,
    () => {
      codeLocalStorage.set(
        'opened-editors',
        fileStore.openEditors.map(e => (isFileInfo(e) ? { ...e, content: [] } : e))
      )
    },
    { deep: true }
  )
}
