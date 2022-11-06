<script lang="ts" setup>
import { provide } from 'vue'
import { handleOpenFile } from './composition'
import DanFileTreeNode from './DanFileTreeNode.vue'
import { clickNodeFnKey, doubleClickFileFnKey } from './data'
import { FileTreeNode } from './types'

defineProps<{
  rootFolder: FileTreeNode
}>()
const emit = defineEmits<{
  (event: 'update:rootFolder', data: FileTreeNode): void
  (event: 'click-node', node: FileTreeNode): void
  (event: 'click-file', node: FileTreeNode): void
  (event: 'click-folder', node: FileTreeNode): void
  (event: 'double-click-file', node: FileTreeNode): void
}>()

let flag = false
const singleClick = (fn: () => void) => {
  flag = false
  setTimeout(() => {
    if (flag) {
      return
    }
    fn()
  }, 300)
}

provide(clickNodeFnKey, node => {
  emit('click-node', node)
  if (node.isDir) {
    emit('click-folder', node)
  } else {
    emit('click-file', node)
    singleClick(() => handleOpenFile(node, true))
  }
})
provide(doubleClickFileFnKey, node => {
  flag = true
  emit('double-click-file', node)
  handleOpenFile(node, false)
})
</script>

<script lang="ts">
export const componentName = 'dan-file-tree'
export default {
  name: componentName,
  components: { DanFileTreeNode }
}
</script>

<template>
  <div class="dan-file-tree">
    <DanFileTreeNode v-for="item in rootFolder.children" :tree-node="item" />
  </div>
</template>

<style lang="scss" scoped></style>
