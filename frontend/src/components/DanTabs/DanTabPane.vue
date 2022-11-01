<script lang="ts" setup>
import { KeyTypes } from '@/types/common'
import { inject, ref } from 'vue'
import { ActiveTabKey, ChangeTabKey } from './data'

defineProps<{
  tab: string
  key: KeyTypes
}>()

const activeTab = inject(ActiveTabKey, ref(''))
const changeTab = inject(ChangeTabKey, () => {})
</script>

<script lang="ts">
export default {
  name: 'dan-tab-pane'
}
</script>

<template>
  <div class="dan-tab-pane" @click.left="changeTab(key)">
    <div class="tab-pane-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
