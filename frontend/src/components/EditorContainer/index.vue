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
        fileStore.changeCurrentEditor(null)
      } else {
        fileStore.changeCurrentEditor(openEditors[index ? index - 1 : 0])
      }
    }
    fileStore.$patch(state => state.openEditors.splice(index, 1))
  }
}
const handleChangeTab = async (key: KeyTypes) => {
  const editor = cloneDeep(fileStore.openEditors.find(f => f.key === key))
  if (editor) {
    if (isFileInfo(editor)) {
      if (!editor.content.length) {
        // 当前页是文件编辑页且没有数据则进行本地文件读取
        const result = await ReadFileContent(editor.path)
        if (!result.message) {
          editor.isBinary = result.isBinary ?? false
          if (!result.isBinary) {
            editor.content = [result.content ?? '']
            renderEditor(editor)
          }
        } else {
          messageSerivce({ type: 'error', message: result.message })
          return
        }
      } else {
        renderEditor(editor)
      }
    } else {
    }
    fileStore.changeCurrentEditor(editor)
  }
}

const renderEditor = (editor: FileInfo) => {
  const targetDom = editorRefs.value.find(ed => ed?.dataset.editorKey === editor.key)
  if (!targetDom || editorContainers.value.has(editor.key)) return

  const monacoInstance = monaco.editor.create(targetDom, {
    language: langsMap[editor.type] || editor.type,
    value: editor.content.join(''),
    automaticLayout: true,
    theme: 'vs-dark'
  })
  editorContainers.value.set(editor.key, monacoInstance)
}

watch(
  () => fileStore.currentEditor?.key,
  () => nextTick(() => handleChangeTab(fileStore.currentEditor?.key || '')),
  { immediate: true }
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
      <DanTabPane v-for="item in fileStore.openEditors" :label="item.name" :tab-key="item.key">
        <div
          v-if="isFileInfo(item) && !item.isBinary"
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
}
</style>
