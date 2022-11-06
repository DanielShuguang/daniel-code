<script lang="ts" setup>
import { ref } from 'vue'
import DanContextmenu from '../DanContextmenu.vue'
import DanSplitLine from '../DanSplitLine.vue'
import DanFileTree from '../DanFileTree/index.vue'
import { useProjectSystemStore } from '@/store'

const defaultWidth = 300
const barWidth = ref(defaultWidth)

const projectStore = useProjectSystemStore()

const handleSplitChange = (offset: number) => {
  barWidth.value += offset
}
</script>

<template>
  <DanContextmenu class="sidebar" :menus="[]">
    <div class="sidebar" :style="{ width: barWidth + 'px' }">
      <DanFileTree v-if="projectStore.currentProject" :root-folder="projectStore.currentProject" />
      <DanSplitLine
        :default-vector="{ x: defaultWidth - 4, y: 0 }"
        @change="handleSplitChange"
        @reset-click="barWidth = defaultWidth"
      />
    </div>
  </DanContextmenu>
</template>

<style lang="scss" scoped>
.sidebar {
  position: relative;
  height: 100%;
  background: var(--left-tool-background);
}
</style>
