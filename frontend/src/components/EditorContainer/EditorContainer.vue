<script lang="ts" setup>
import { useFileSystemStore } from '@/store'
import { KeyTypes, Nullable } from '@/types/common'
import { computed, nextTick, ref, shallowRef, watch } from 'vue'
import { ReadFileContent } from 'backend/core/App'
import DanTabPane from '../../ui-components/DanTabs/DanTabPane.vue'
import DanTabs from '../../ui-components/DanTabs/DanTabs.vue'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { isFileInfo } from '@/utils/type-check'
import { messageSerivce } from '../MessageBox/composition'
import { cloneDeep } from 'lodash-es'
import { FileInfo } from '@/types/file-system'
import { useSaveFileContent, useResizeEditorContainer, editorEventHandler } from './composition'
import { langsMap } from '@/utils/language'
import { useEventListener } from '@vueuse/core'
import { FileEditorOptions } from './types'
import { codicon } from '@/utils/codicon'
import classNames from 'classnames'
import { useCommandService } from '@/commands'

const fileStore = useFileSystemStore()

const editorRefs = ref<Nullable<HTMLDivElement>[]>([])
const activeTab = computed(() => fileStore.currentEditor?.key || '')
const editorContainers = shallowRef(new Map<string, FileEditorOptions>())

const { containerRect } = useResizeEditorContainer()
useSaveFileContent(editorContainers, activeTab)
useEventListener('keydown', ev => {
  if (ev.ctrlKey && ev.key === 'w' && fileStore.currentEditor?.key) {
    handleCloseTab(fileStore.currentEditor.key)
  }
})
useCommandService('file-close-editor-tab', key => handleCloseTab(key))
useCommandService('file-updated', (key, content) => {
  const editor = editorContainers.value.get(key)
  if (editor) {
    editor.instance.setValue(content)
    nextTick(() => {
      editor.modified.value = false
    })
  }
})

const handleCloseTab = (key: KeyTypes) => {
  const { openEditors } = fileStore
  const index = openEditors.findIndex(el => el.key === key)
  if (index !== -1) {
    const key = openEditors[index].key
    editorContainers.value.get(key)?.instance?.dispose()
    editorContainers.value.delete(key)
    if (key === fileStore.currentEditor?.key) {
      if (openEditors.length === 1) {
        fileStore.changeCurrentEditor(null, false)
      } else {
        nextTick(() => {
          const current = openEditors[index ? index - 1 : 0]
          fileStore.changeCurrentEditor(current, current.viewMode)
        })
      }
    }
    fileStore.$state.openEditors.splice(index, 1)
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
      // TODO: 自定义窗口
    }
    fileStore.changeCurrentEditor(editor, editor.viewMode)
  }
}

/** 将文件内容渲染到 monaco-editor 中 */
const renderEditor = (editor: FileInfo) => {
  const targetDom = editorRefs.value.find(ed => ed?.dataset.editorKey === editor.path)
  if (!targetDom || editorContainers.value.has(editor.path)) return

  const monacoInstance = monaco.editor.create(targetDom, {
    language: langsMap[editor.type] || editor.type,
    value: editor.content.join(''),
    automaticLayout: true,
    theme: 'vs-dark'
  })
  monacoInstance.getModel()?.onDidChangeContent(() => {
    const key = editor.path
    const target = editorContainers.value.get(key)
    if (target) {
      target.modified.value = true
      const ed = fileStore.$state.openEditors.find(el => el.key === key)
      if (ed) {
        ed.viewMode = false
      }
    }
  })
  editorEventHandler(monacoInstance)
  editorContainers.value.set(editor.path, { instance: monacoInstance, modified: ref(false) })
}

const handleDbClick = (tabKey: KeyTypes) => {
  const target = fileStore.$state.openEditors.find(el => el.key === tabKey)
  if (target) {
    target.viewMode = false
  }
}

/** 确认 tab 是否为预览状态 */
const getCurrentTabDetails = (key: KeyTypes) => {
  return fileStore.openEditors.find(el => isFileInfo(el.file) && el.key === key)?.viewMode
}

/** 根据编辑器状态显示不同的关闭键 */
const getTabClassname = (key: KeyTypes) => {
  const target = editorContainers.value.get(key.toString())
  return classNames('tab-close', codicon(target?.modified.value ? 'circle-filled' : 'close'), {
    'show-icon': target?.modified || activeTab.value === key
  })
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
      @double-click-tab="handleDbClick"
    >
      <template #tab-render="tabInfo">
        <span :class="['label-name', { 'is-view-mode': getCurrentTabDetails(tabInfo.tabKey) }]">
          {{ tabInfo.label }}
        </span>
      </template>
      <template #close-btn="tab">
        <a :class="getTabClassname(tab.tabKey)" @click.stop="handleCloseTab(tab.tabKey)"></a>
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
