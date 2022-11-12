import { commandSerivce } from '@/commands'
import { Nullable } from '@/types/common'
import { useResizeObserver, useWindowSize } from '@vueuse/core'
import { onMounted, onUnmounted, Ref, ref, ShallowRef, watch } from 'vue'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { FileEditorOptions } from './types'

/** 自适应更新编辑区的宽高 */
export const useResizeEditorContainer = () => {
  const containerRect = ref({ width: '0', height: '0' })
  const selector = '.plugin-toolbar.left-bar[data-code-plugin]'

  const resize = () => {
    const dom = document.querySelector<HTMLDivElement>(selector)
    if (dom) {
      const rect = dom.getBoundingClientRect()
      const height = window.innerHeight - 30 - 22 + 'px'
      const width = window.innerWidth - rect.width - 2 + 'px'
      containerRect.value = { height, width }
    }
  }

  useResizeObserver(document.querySelector<HTMLDivElement>(selector), () => {
    resize()
  })

  const { height, width } = useWindowSize()

  watch([height, width], resize)

  onMounted(resize)

  return { containerRect }
}

/**
 * 保存已修改的文件内容
 * @param containers
 * @param activeTab
 */
export const useSaveFileContent = (
  containers: ShallowRef<Map<string, FileEditorOptions>>,
  activeTab: Ref<string>
) => {
  const isSaving = ref(false)
  const timer = ref<Nullable<NodeJS.Timeout>>(null)

  onMounted(() => {
    commandSerivce.registerCommand('file-get-opend-files', () => containers.value)
    commandSerivce.registerCommand('file-read-current-content', () => {
      const editor = containers.value.get(activeTab.value)
      if (!editor) return null
      const result = {
        content: editor.instance.getValue() || '',
        hasModified: !!editor.modified.value,
        filePath: activeTab.value
      }
      if (result.hasModified) {
        timer.value = setTimeout(() => {
          isSaving.value = true
          timer.value = null
        }, 500)
      }
      return result
    })
    commandSerivce.registerCommand('file-save-complete', key => {
      timer.value && clearTimeout(timer.value)
      const editor = containers.value.get(key)
      if (editor) {
        editor.modified.value = false
      }
      isSaving.value = false
    })
  })

  onUnmounted(() => {
    commandSerivce.unregisterCommand('file-read-current-content')
    commandSerivce.unregisterCommand('file-save-complete')
    commandSerivce.unregisterCommand('file-get-opend-files')
  })

  return { isSaving }
}

export const editorEventHandler = (monacoInstance: monaco.editor.IStandaloneCodeEditor) => {
  monacoInstance.onKeyDown(ev => {
    if (ev.ctrlKey && ev.browserEvent.key === 's') {
      commandSerivce.execCommand('topmenu-save')
    }
  })
}
