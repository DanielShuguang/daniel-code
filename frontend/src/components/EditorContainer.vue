<script lang="ts" setup>
import { ref } from 'vue'
import DanTabPane from './DanTabs/DanTabPane.vue'
import DanTabs from './DanTabs/index.vue'

const activeTab = ref('1')
const count = ref(3)

setInterval(() => {
  count.value += 1
}, 1500)
</script>

<template>
  <div class="main-editor">
    <DanTabs v-model="activeTab">
      <DanTabPane tab="tab 1" key="1">tab 1</DanTabPane>
      <DanTabPane tab="tab 2" key="2">tab 2</DanTabPane>
      <DanTabPane :tab="`tab 3`" key="3">tab {{ count }}</DanTabPane>
      <div class="test-div"></div>
    </DanTabs>
  </div>
</template>

<style lang="scss" scoped>
.main-editor {
  width: 100%;
  height: 100%;
}
</style>
