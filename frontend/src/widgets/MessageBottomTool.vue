<script lang="ts" setup>
import { commandSerivce } from '@/commands'
import { codicon } from '@/utils/codicon'

/** 开启/关闭消息盒子 */
const handleToggleMessageBox = () => {
  commandSerivce.execCommand('dan-code-open-message-box')
}
</script>

<template>
  <div class="message-box-btn bottom-tool-item" @click="handleToggleMessageBox">
    <a :class="['btn-icon', codicon('bell')]"></a>
  </div>
</template>

<style lang="scss" scoped>
div.message-box-btn {
  line-height: 22px;
  height: 100%;
  vertical-align: top;
  max-width: 40vw;

  .btn-icon {
    display: flex;
    height: 100%;
    margin: 0 3px;
    padding: 0 5px;
    color: var(--active-plugin-color);
    white-space: pre;
    align-items: center;
    text-overflow: ellipsis;
    overflow: hidden;
    outline-width: 0;
  }
}
</style>
