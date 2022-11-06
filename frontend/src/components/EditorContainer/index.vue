<script lang="ts" setup>
import { useFileSystemStore } from '@/store'
import { KeyTypes, Nullable } from '@/types/common'
import { computed, nextTick, ref, shallowRef, watch } from 'vue'
import { ReadFileContent } from 'backend/core/App'
import DanTabPane from '../DanTabs/DanTabPane.vue'
import DanTabs from '../DanTabs/index.vue'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { isFileInfo } from '@/utils/type-check'
import { messageSerivce } from '../DanMessage/composition'
import { cloneDeep } from 'lodash-es'
import { FileInfo } from '@/types/file-system'
import { useResizeEditorContainer } from './composition'
import { langsMap } from '@/utils/language'
import { useEventListener } from '@vueuse/core'

const fileStore = useFileSystemStore()

const editorRefs = ref<Nullable<HTMLDivElement>[]>([])
const activeTab = computed(() => fileStore.currentEditor?.key || '')
const editorContainers = shallowRef(new Map<string, monaco.editor.IStandaloneCodeEditor>())

const { containerRect } = useResizeEditorContainer()
useEventListener('keydown', ev => {
  if (ev.ctrlKey && ev.key === 'w' && fileStore.currentEditor?.key) {
    handleCloseTab(fileStore.currentEditor.key)
  }
})

const handleCloseTab = (key: KeyTypes) => {
  const index = fileStore.openEditors.findIndex(el => el.key === key)
  if (index !== -1) {
    const { openEditors } = fileStore
    const key = openEditors[index].key
    editorContainers.value.get(key)?.dispose()
    editorContainers.value.delete(key)
    if (key === fileStore.currentEditor?.key) {
      if (openEditors.length === 1) {
        fileStore.changeCurrentEditor(null, false)
      } else {
        const current = openEditors[index ? index - 1 : 0]
        fileStore.changeCurrentEditor(current, current.viewMode)
      }
    }
    fileStore.$patch(state => state.openEditors.splice(index, 1))
  }
}
const handleChangeTab = async (key: KeyTypes) => {
  const editor = cloneDeep(fileStore.openEditors.find(f => f.key === key))
  if (editor) {
    const { file } = editor
    if (isFileInfo(file)) {
      if (!file.content.length) {
        // 当前页是文件编辑页且没有数据则进行本地文件读取
        const result = await ReadFileContent(file.path)
        if (!result.message) {
          file.isBinary = result.isBinary ?? false
          if (!result.isBinary) {
            file.content = [result.content ?? '']
            renderEditor(file)
          }
        } else {
          messageSerivce({ type: 'error', message: result.message })
          return
        }
      } else {
        file && renderEditor(file)
      }
    } else {
    }
    fileStore.changeCurrentEditor(editor, editor.viewMode)
  }
}

const renderEditor = (editor: FileInfo) => {
  const targetDom = editorRefs.value.find(ed => ed?.dataset.editorKey === editor.path)
  if (!targetDom || editorContainers.value.has(editor.path)) return

  const monacoInstance = monaco.editor.create(targetDom, {
    language: langsMap[editor.type] || editor.type,
    value: editor.content.join(''),
    automaticLayout: true,
    theme: 'vs-dark'
  })
  editorContainers.value.set(editor.path, monacoInstance)
}

const getCurrentTabDetails = (key: KeyTypes) => {
  return fileStore.openEditors.find(el => isFileInfo(el.file) && el.key === key)?.viewMode
}

watch(
  () => fileStore.currentEditor?.key,
  () => nextTick(() => handleChangeTab(fileStore.currentEditor?.key || ''))
)
</script>

<template>
  <div class="main-editor">
    <DanTabs
      v-show="fileStore.openEditors.length"
      :model-value="activeTab"
      :style="containerRect"
      type="card"
      closable
      @change="handleChangeTab"
      @close-tab="handleCloseTab"
    >
      <template #tab-render="tabInfo">
        <span :class="['label-name', { 'is-view-mode': getCurrentTabDetails(tabInfo.tabKey) }]">
          {{ tabInfo.label }}
        </span>
      </template>
      <DanTabPane
        v-for="item in fileStore.openEditors"
        :key="item.key"
        :label="item.name"
        :tab-key="item.key"
      >
        <div
          v-if="isFileInfo(item.file) && !item.file.isBinary"
          class="editor-box"
          ref="editorRefs"
          :data-editor-key="item.key"
        ></div>
      </DanTabPane>
    </DanTabs>
  </div>
</template>

<style lang="scss" scoped>
.main-editor {
  position: relative;
  width: 100%;
  height: 100%;
  border-right: 2px solid transparent;
  box-sizing: border-box;

  .editor-box {
    width: 100%;
    height: 100%;
  }
  .label-name.is-view-mode {
    font-style: italic;
  }
}
</style>
