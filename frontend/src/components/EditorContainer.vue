<script lang="ts" setup>
import { ref } from 'vue'
import DanTabPane from './DanTabs/DanTabPane.vue'
import DanTabs from './DanTabs/index.vue'

const activeTab = ref('1')
</script>

<template>
  <div class="main-editor">
    <DanTabs v-model="activeTab" style="height: 100%" type="card" closable>
      <template #tab-render="tab">{{ tab.label }} -- {{ tab.name }}</template>
      <DanTabPane label="tab 1" name="1">tab 1</DanTabPane>
      <DanTabPane label="tab 2" name="2">tab 2</DanTabPane>
      <DanTabPane label="tab 3" name="3">tab 3</DanTabPane>
    </DanTabs>
  </div>
</template>

<style lang="scss" scoped>
.main-editor {
  width: 100%;
  height: 100%;
}
</style>
