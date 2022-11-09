<script lang="ts" setup>
import { ref } from 'vue'
import { useMessageEvents } from '../../ui-components/DanMessage/composition'
import DanMessageItem from './DanMessageItem.vue'

const visible = ref(false)
const showNewMessage = ref(false)

const { messageList } = useMessageEvents()
</script>

<template>
  <teleport to="body">
    <div v-show="visible" class="notifications-center">
      <div class="notifications-center-header">
        <div class="header-title">通知</div>
      </div>
      <div class="notifications-list-container"></div>
    </div>
    <template v-show="showNewMessage">
      <div class="new-notifications-list">
        <DanMessageItem
          v-for="[key, opt] in messageList"
          :key="key"
          class="notifications-list-row"
          :message-opt="opt"
          @close="messageList.delete(key)"
        />
      </div>
    </template>
  </teleport>
</template>

<style lang="scss" scoped>
.notifications-center,
.new-notifications-list {
  position: fixed;
  right: 8px;
  bottom: 31px;
}
.new-notifications-list {
  .notifications {
    &-list-row {
      margin-bottom: 5px;

      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
</style>
