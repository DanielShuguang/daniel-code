<script lang="ts" setup>
import { useMessageStore } from '@/store'
import { codicon } from '@/utils/codicon'
import { computed } from 'vue'

const messageStore = useMessageStore()

const hasMessage = computed(() => messageStore.$state.messageCount !== 0)
</script>

<template>
  <div class="message-box-btn bottom-tool-item" v-command="'dan-code-open-message-box'">
    <a :class="['btn-icon', codicon(hasMessage ? 'bell-dot' : 'bell')]"></a>
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
