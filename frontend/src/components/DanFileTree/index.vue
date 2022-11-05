<script lang="ts" setup>
import { codicon } from '@/utils/codicon'
import { FileTreeNode } from './types'

defineProps<{
  fileTree: FileTreeNode[]
}>()
defineEmits<{
  (event: 'click-node', node: FileTreeNode): void
}>()
</script>

<script lang="ts">
export default {
  name: 'dan-file-tree'
}
</script>

<template>
  <div class="dan-file-tree">
    <div
      v-for="item in fileTree"
      class="file-tree-node"
      :key="item.path"
      @click.left="item.isDir && $emit('click-node', item)"
    >
      <div class="indent">
        <div
          v-if="item.isDir"
          :class="[
            'expand-icon',
            codicon('tree-item-expanded'),
            { 'is-expanded': item.isExpanded }
          ]"
        ></div>
      </div>
      <div class="file-icon"></div>
      <div class="file-name">{{ item.name }}</div>
      <DanFileTree v-if="item.hasChildren && item.children" :file-list="item.children" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
