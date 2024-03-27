<script lang="ts" setup>
import { Dict, KeyTypes } from '@/types/common'
import { codicon } from '@/utils/codicon'
import { isObject } from 'lodash-es'
import DanTabPane from './DanTabPane.vue'
import { ActiveTabKey, DestroyTabKey } from './data'
import { TabItem } from './types'

const props = withDefaults(
  defineProps<{
    modelValue: KeyTypes
    destroyInactiveTabPane?: boolean
    closable?: boolean
    type?: 'card'
  }>(),
  { destroyInactiveTabPane: false }
)
const emit = defineEmits<{
  (event: 'update:modelValue', val: KeyTypes): void
  (event: 'closeTab', val: KeyTypes): void
  (event: 'change', val: KeyTypes): void
  (event: 'doubleClickTab', val: KeyTypes): void
}>()
const { modelValue, destroyInactiveTabPane } = toRefs(props)

const tabList = ref<TabItem[]>([])

const slots = useSlots()

const handleChangeActiveTab = (name: KeyTypes) => {
  emit('update:modelValue', name)
  emit('change', name)
}

provide(ActiveTabKey, readonly(modelValue))
provide(DestroyTabKey, readonly(destroyInactiveTabPane))

watchEffect(() => {
  const defaultSlots = slots.default?.()
  const children = (defaultSlots?.[0] as any)?.children as VNode[]
  if (children?.length) {
    const list: TabItem[] = []
    children.forEach(child => {
      const { type } = child
      if (isObject(type) && 'name' in type && type.name === DanTabPane.name) {
        const props = child.props as Dict<string, string>
        const tabKey = props['tab-key'] || props.tabKey
        tabKey &&
          list.push({
            label: props.label || tabKey,
            tabKey
          })
      }
    })
    tabList.value = list
  }
})
</script>

<template>
  <div class="dan-tabs">
    <div :class="['tabs-header-holder', { 'card-tabs': type }]">
      <div
        v-for="tab in tabList"
        :key="tab.tabKey"
        :class="['tab-item', { 'card-tab': type }, { 'is-active': modelValue === tab.tabKey }]"
        @click="handleChangeActiveTab(tab.tabKey)"
        @dblclick="$emit('doubleClickTab', tab.tabKey)"
      >
        <slot name="tab-render" :="tab">
          <span class="tab-title">{{ tab.label }}</span>
        </slot>
        <slot name="close-btn" :activeTab="modelValue" :="tab">
          <a
            v-if="closable"
            :class="['tab-close', codicon('close'), { 'show-icon': modelValue === tab.tabKey }]"
            @click.stop="$emit('closeTab', tab.tabKey)"
          ></a>
        </slot>
      </div>
    </div>
    <div class="tab-content-holder">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
.dan-tabs {
  width: 100%;
}
.tabs-header-holder {
  display: flex;
  height: 35px;

  &.card-tabs {
    background: var(--left-tool-background);
  }
}
.tab-item {
  display: flex;
  align-items: center;
  height: 35px;
  padding-left: 10px;
  font-size: 13px;
  color: var(--default-tab-color);
  cursor: pointer;

  &:hover {
    .tab-close {
      visibility: visible;
    }
  }

  &.is-active {
    color: var(--active-plugin-color);
    &:not(.card-tab) {
      .tab-title {
        border-bottom: 1px solid var(--active-plugin-color);
      }
    }
  }
  &.card-tab {
    background: var(--editor-tab-background);
    border-right: 1px solid var(--left-tool-background);

    &.is-active {
      background: var(--editor-background);
    }
  }

  .tab-title {
    height: 100%;
    line-height: 35px;
  }

  .tab-close {
    visibility: hidden;
    width: 16px;
    height: 16px;
    margin: 0 6px;
    padding: 2px;
    border-radius: 5px;

    &:hover {
      background: var(--top-menu-hoverbackground);
    }

    &.show-icon {
      visibility: inherit;
    }
  }
}
.tab-content-holder {
  width: 100%;
  height: calc(100% - 35px);
}
</style>
