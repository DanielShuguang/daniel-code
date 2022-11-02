<script lang="ts" setup>
import { Dict, KeyTypes } from '@/types/common'
import { isObject } from 'lodash-es'
import { provide, readonly, ref, toRefs, useSlots, watchEffect } from 'vue'
import { ActiveTabKey, DestroyTabKey } from './data'
import { TabItem } from './types'

const props = withDefaults(
  defineProps<{
    modelValue: KeyTypes
    destroyInactiveTabPane?: boolean
  }>(),
  { destroyInactiveTabPane: false }
)
const emit = defineEmits<{
  (event: 'update:modelValue', val: KeyTypes): void
  (event: 'change', val: KeyTypes): void
}>()
const { modelValue, destroyInactiveTabPane } = toRefs(props)

const tabList = ref<TabItem[]>([])

const slots = useSlots()

const handleChangeActiveTab = (key: KeyTypes) => {
  emit('update:modelValue', key)
  emit('change', key)
}

provide(ActiveTabKey, readonly(modelValue))
provide(DestroyTabKey, readonly(destroyInactiveTabPane))

watchEffect(() => {
  const children = slots.default?.()
  if (children) {
    children.forEach(child => {
      const { type } = child
      if (isObject(type) && 'name' in type && type.name === 'dan-tab-pane') {
        const { key, tab } = child.props as Dict<string, string>
        key &&
          tabList.value.push({
            tab: tab || key,
            key: key
          })
      }
    })
  }
})
</script>

<template>
  <div class="dan-tabs">
    <div class="tabs-header-holder">
      <div
        v-for="tab in tabList"
        :key="tab.key"
        class="tab-item"
        @click.left="handleChangeActiveTab(tab.key)"
      >
        {{ tab.tab }}
      </div>
    </div>
    <div class="tab-content-holder">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dan-tabs {
  width: 100%;
}
</style>
