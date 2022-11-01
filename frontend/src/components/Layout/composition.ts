import { useBaseStore, useFileSystemStore, usePluginStore, useProjectSystemStore } from '@/store'
import { codeLocalStorage } from '@/utils/storage'
import { onBeforeMount, onMounted } from 'vue'
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
  /** 初始化上一次打开的文件 */
  const initFile = (isProject: boolean) => {
    const activeFile = codeLocalStorage.get('active-file')
    const openFiles = codeLocalStorage.get('open-files')
    if (activeFile) {
      if (!activeFile.isProject || isProject) {
        fileStore.changeCurrentFile(activeFile)
      }

      if (openFiles?.length && (!openFiles?.[0].isProject || isProject)) {
        fileStore.changeOpenFiles(...openFiles)
      }
    }
  }

  onMounted(() => {
    initProject()
    initPlugin()
  })
}
