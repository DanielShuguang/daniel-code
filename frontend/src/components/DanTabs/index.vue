<script lang="ts" setup>
import { KeyTypes } from '@/types/common'
import { provide, readonly, toRefs } from 'vue'
import { ActiveTabKey, ChangeTabKey } from './data'

const props = defineProps<{
  modelValue: KeyTypes
}>()
const emit = defineEmits<{
  (event: 'update:modelValue', val: KeyTypes): void
  (event: 'change', val: KeyTypes): void
}>()

const { modelValue } = toRefs(props)
const handleChangeActiveTab = (key: KeyTypes) => {
  emit('update:modelValue', key)
  emit('change', key)
}

provide(ActiveTabKey, readonly(modelValue))
provide(ChangeTabKey, handleChangeActiveTab)
</script>

<template>
  <div class="dan-tabs">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.dan-tabs {
  width: 100%;
}
</style>
