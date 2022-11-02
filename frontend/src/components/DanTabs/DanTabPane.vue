<script lang="ts" setup>
import { KeyTypes } from '@/types/common'
import { inject } from 'vue'
import { ActiveTabKey, DestroyTabKey } from './data'

defineProps<{
  tab: string
  key: KeyTypes
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
    v-show="activeTab === key"
    v-if="!destroyInactiveTabPane || activeTab === key"
    class="dan-tab-pane"
  >
    <div class="tab-pane-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
