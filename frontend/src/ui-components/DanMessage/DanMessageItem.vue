<script lang="ts" setup>
import { codicon } from '@/utils/codicon'
import { TimeUtils } from '@/utils/time-utils'
import { onMounted } from 'vue'
import { MessageOption } from './types'

const props = defineProps<{
  messageOpt: MessageOption
}>()
const emit = defineEmits<{
  (event: 'close'): void
}>()

onMounted(() => {
  const { timeout = 3 * TimeUtils.SECOND } = props.messageOpt
  if (timeout) {
    setTimeout(() => {
      emit('close')
    }, timeout)
  }
})
</script>

<template>
  <div class="notifications-list-row">
    <div :class="['notification-icon', codicon(messageOpt.type)]"></div>
    <div class="notification-message">
      <div class="message-content">{{ messageOpt.message }}</div>
      <div v-if="messageOpt.reasons?.length" class="message-operation">
        <button
          v-for="rea in messageOpt.reasons"
          :key="rea"
          class="operation-btn"
          @click="messageOpt.callback?.(rea)"
        >
          {{ rea }}
        </button>
      </div>
    </div>
    <div :class="['close-icon', codicon('close')]"></div>
  </div>
</template>

<style lang="scss" scoped></style>
