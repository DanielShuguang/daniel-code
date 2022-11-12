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
    <div class="operation">
      <div :class="['close-icon', codicon('close')]" @click="$emit('close')"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notifications-list-row {
  display: flex;
  margin: 6px;
  padding: 5px 4px 7px;
  background: var(--message-container-background);
  cursor: pointer;
  user-select: text;

  > div {
    height: 100%;
  }

  .notification-icon {
    width: 22px;
    font-size: 18px;
    &.codicon-info {
      color: var(--bottom-toolbar-background);
    }
    &.codion-warn {
      color: var(--warn-background);
    }
    &.codion-error {
      color: var(--close-window-control-color);
    }
  }
  .operation {
    width: 20px;
    font-size: 16px;
    .close-icon {
      width: 16px;
      height: 16px;
      border-radius: 5px;

      &:hover {
        background: var(--top-menu-hoverbackground);
      }
    }
  }

  .notification-message {
    flex: 1;
    margin-top: 3px;
  }
}
</style>
