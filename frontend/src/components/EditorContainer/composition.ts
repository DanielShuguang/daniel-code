import { commandSerivce, useCommandService } from '@/commands'
import { Nullable } from '@/types/common'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { FileEditorOptions } from './types'
import { ShallowRef } from 'vue'

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

  useCommandService('file-get-opend-files', () => containers.value)
  useCommandService('file-read-current-content', () => {
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
  useCommandService('file-save-complete', key => {
    timer.value && clearTimeout(timer.value)
    const editor = containers.value.get(key)
    if (editor) {
      editor.modified.value = false
    }
    isSaving.value = false
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
