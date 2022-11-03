<script lang="ts" setup>
import { useFileSystemStore } from '@/store'
import { KeyTypes, Nullable } from '@/types/common'
import { computed, nextTick, ref, shallowRef, watch } from 'vue'
import { ReadFileContent } from 'backend/core/App'
import DanTabPane from './DanTabs/DanTabPane.vue'
import DanTabs from './DanTabs/index.vue'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import { isFileInfo } from '@/utils/type-check'
import { messageSerivce } from './DanMessage/composition'
import { cloneDeep } from 'lodash-es'
import { FileInfo } from '@/types/file-system'

const fileStore = useFileSystemStore()

const editorRefs = ref<Nullable<HTMLDivElement>[]>([])
const activeTab = computed(() => fileStore.currentEditor?.key || '')
const editors = shallowRef(new Map<string, monaco.editor.IStandaloneCodeEditor>())

const handleCloseTab = (key: KeyTypes) => {
  const index = fileStore.openEditors.findIndex(el => el.key === key)
  if (index !== -1) {
    const { openEditors } = fileStore
    if (openEditors[index].key === fileStore.currentEditor?.key) {
      if (openEditors.length === 1) {
        fileStore.changeCurrentEditor(null)
      } else {
        fileStore.changeCurrentEditor(openEditors[index ? index - 1 : 0])
      }
    }
    editors.value.delete(openEditors[index].key)
    openEditors.splice(index, 1)
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
        if (!result.errorMessage) {
          editor.isBinary = result.isBinary ?? false
          if (!result.isBinary) {
            editor.content = [result.content ?? '']
            renderEditor(editor)
          }
        } else {
          messageSerivce({ type: 'error', message: result.errorMessage })
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

const initEditors = () => {
  editorRefs.value.forEach(edRef => {
    const key = edRef?.dataset.editorKey || ''
    const editor = fileStore.openEditors.find(e => e.key === key)
    if (edRef && isFileInfo(editor) && !editors.value.has(key)) {
      const monacoInstance = monaco.editor.create(edRef, {
        language: editor.type
      })
      editors.value.set(editor.key, monacoInstance)
    }
  })
}

const renderEditor = (editor: FileInfo) => {
  const targetDom = editorRefs.value.find(ed => ed?.dataset.editorKey === editor.key)
  if (!targetDom || editors.value.has(editor.key)) return

  const monacoInstance = monaco.editor.create(targetDom, {
    language: editor.type,
    value: editor.content.join('')
  })
  editors.value.set(editor.key, monacoInstance)
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
      style="height: 100%"
      type="card"
      closable
      @change="handleChangeTab"
      @close-tab="handleCloseTab"
    >
      <template #tab-render="tab">{{ tab.label }} -- {{ tab.tabKey }}</template>
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
  width: 100%;
  height: 100%;

  .editor-box {
    width: 100%;
    height: 100%;
  }
}
</style>
