<script lang="ts" setup>
import { KeyTypes } from '@/types/common'
import { inject } from 'vue'
import { ActiveTabKey, DestroyTabKey } from './data'

defineProps<{
  label: string
  tabKey: KeyTypes
}>()

const activeTab = inject(ActiveTabKey)
const destroyInactiveTabPane = inject(DestroyTabKey)
</script>

<script lang="ts">
export default {
  name: 'dan-tab-pane'
}
</script>

<template>
  <div
    v-show="activeTab === tabKey"
    v-if="!destroyInactiveTabPane || activeTab === tabKey"
    class="dan-tab-pane"
  >
    <div class="tab-pane-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dan-tab-pane,
.tab-pane-content {
  width: 100%;
  height: 100%;
}
</style>
