import { useBaseStore, useFileSystemStore, usePluginStore, useProjectSystemStore } from '@/store'
import { EditorDetails } from '@/types/file-system'
import { codeLocalStorage } from '@/utils/storage'
import { TimeUtils } from '@/utils/time-utils'
import { isFileInfo } from '@/utils/type-check'
import { debounce } from 'lodash-es'
import { EventsEmit } from 'runtime'
import { onBeforeMount, onMounted, watch } from 'vue'
import { plugins } from '../LeftToolbar/data'

/** 响应窗口失焦、聚焦状态 */
export const useWindowsFocusHandler = () => {
  const baseStore = useBaseStore()

  onBeforeMount(() => {
    window.onblur = () => {
      baseStore.$state.isWindowActive = false
    }
    window.onfocus = () => {
      baseStore.$state.isWindowActive = true
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
      projectStore.$state.currentProject = activeProject
      EventsEmit('backend:update-project-path', activeProject.path)
    }
    initFile(!!activeProject)
  }
  /**
   * 初始化上一次打开的文件
   * @param isProject 上次开启时是否为项目工程
   */
  const initFile = (isProject: boolean) => {
    const openedEditors = codeLocalStorage.get('opened-editors')

    const editors: EditorDetails[] = []
    const shouldOpen = openedEditors?.every(ed => {
      // 如果上次打开时为项目，则检测是否已激活项目
      // 如果上次未打开项目，则打开之前已打开的独立文件
      if (isFileInfo(ed) && ed.isProject && !isProject) {
        return false
      }
      editors.push(ed)
      return true
    })
    if (shouldOpen) {
      fileStore.$state.openEditors = editors
      const activeFile = codeLocalStorage.get('active-editor')
      const obj = activeFile ?? editors[0]
      fileStore.changeCurrentEditor(obj, obj?.viewMode ?? false)
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
  const projectStore = useProjectSystemStore()

  const cacheProject = debounce(() => {
    codeLocalStorage.set('active-project', projectStore.currentProject)
  }, TimeUtils.SECOND * 5)

  watch(
    () => fileStore.openEditors,
    () => {
      codeLocalStorage.set(
        'opened-editors',
        fileStore.openEditors.map(e => {
          const obj: EditorDetails = {
            ...e,
            file: isFileInfo(e.file) ? { ...e.file, content: [] } : undefined
          }
          return obj
        })
      )
    },
    { deep: true }
  )

  watch(() => projectStore.currentProject, cacheProject, { deep: true })
}
