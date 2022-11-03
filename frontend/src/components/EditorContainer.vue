<script lang="ts" setup>
import { useFileSystemStore } from '@/store'
import { KeyTypes, Nullable } from '@/types/common'
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import { ReadFileContent } from 'backend/core/App'
import DanTabPane from './DanTabs/DanTabPane.vue'
import DanTabs from './DanTabs/index.vue'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import { isFileInfo } from '@/utils/type-check'
import { messageSerivce } from './DanMessage/composition'
import { cloneDeep, pick } from 'lodash-es'
import { FileInfo } from '@/types/file-system'

const fileStore = useFileSystemStore()

const editorRefs = ref<Nullable<HTMLDivElement>[]>([])
const activeTab = computed(() => fileStore.currentEditor?.key || '')
const editorContainers = shallowRef(new Map<string, monaco.editor.IStandaloneCodeEditor>())
const observer = shallowRef<Nullable<ResizeObserver>>(null)
const mainDomRef = ref<Nullable<HTMLDivElement>>(null)

const handleCloseTab = (key: KeyTypes) => {
  const index = fileStore.openEditors.findIndex(el => el.key === key)
  if (index !== -1) {
    const { openEditors } = fileStore
    const key = openEditors[index].key
    if (key === fileStore.currentEditor?.key) {
      if (openEditors.length === 1) {
        fileStore.changeCurrentEditor(null)
      } else {
        fileStore.changeCurrentEditor(openEditors[index ? index - 1 : 0])
      }
    }
    editorContainers.value.get(key)?.dispose()
    editorContainers.value.delete(key)
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

const renderEditor = (editor: FileInfo) => {
  const targetDom = editorRefs.value.find(ed => ed?.dataset.editorKey === editor.key)
  if (!targetDom || editorContainers.value.has(editor.key)) return

  const monacoInstance = monaco.editor.create(targetDom, {
    language: editor.type,
    value: editor.content.join(''),
    automaticLayout: true
  })
  editorContainers.value.set(editor.key, monacoInstance)
}

watch(
  () => fileStore.currentEditor?.key,
  () => nextTick(() => handleChangeTab(fileStore.currentEditor?.key || '')),
  { immediate: true }
)

onMounted(() => {
  observer.value = new ResizeObserver(() => {
    const key = fileStore.currentEditor?.key
    const rect = editorRefs.value.find(el => el?.dataset.editorKey === key)?.getBoundingClientRect()
    if (key && rect) {
      console.log(rect)
      editorContainers.value.get(key)?.layout(pick(rect, ['width', 'height']))
    }
  })
  mainDomRef.value && observer.value.observe(mainDomRef.value)
  console.log(mainDomRef.value)
  window.onresize = () => {
    console.log('window resize')
  }
})
</script>

<template>
  <div class="main-editor" ref="mainDomRef">
    <DanTabs
      v-show="fileStore.openEditors.length"
      :model-value="activeTab"
      style="height: 100%"
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
  width: 100%;
  height: 100%;

  .editor-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
