<script lang="ts" setup>
import { useFileSystemStore } from '@/store'
import { KeyTypes, Nullable } from '@/types/common'
import { computed, ref, shallowRef, watch } from 'vue'
import { ReadFileContent } from 'backend/core/App'
import DanTabPane from './DanTabs/DanTabPane.vue'
import DanTabs from './DanTabs/index.vue'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import { isFileInfo } from '@/utils/type-check'
import { messageSerivce } from './DanMessage/composition'

const fileStore = useFileSystemStore()

const editorRefs = ref<Nullable<HTMLDivElement>[]>([])
const activeTab = computed(() => fileStore.currentEditor?.key || '')
const editors = shallowRef(new Map<string, monaco.editor.IStandaloneCodeEditor>())

const handleCloseTab = (key: KeyTypes) => {
  console.log(key)
}
const handleChangeTab = async (key: KeyTypes) => {
  const editor = fileStore.openEditors.find(f => f.key === key)
  if (editor) {
    if (isFileInfo(editor) && !editor.content.length) {
      // 当前页是文件编辑页且没有数据则进行本地文件读取
      const result = await ReadFileContent(editor.path)
      if (!result.errorMessage) {
        editor.isBinary = result.isBinary ?? false
        if (!result.isBinary) {
          editor.content = [result.content ?? '']
        }
      } else {
        messageSerivce({ type: 'error', message: result.errorMessage })
        return
      }
    } else if (!isFileInfo(editor)) {
    }
    fileStore.changeCurrentEditor(editor)
  }
}

const initEditors = () => {
  editorRefs.value.forEach((edRef, i) => {
    const editor = fileStore.openEditors.find(e => e.key === edRef?.dataset['editor-key'])
    if (edRef && isFileInfo(editor)) {
      const monacoInstance = monaco.editor.create(edRef, {
        language: editor.type
      })
      editors.value.set(editor.key, monacoInstance)
    }
  })
}

watch(editorRefs, initEditors, { immediate: true })
</script>

<template>
  <div class="main-editor">
    <DanTabs
      v-show="fileStore.openEditors.length"
      v-model="activeTab"
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
}
</style>
