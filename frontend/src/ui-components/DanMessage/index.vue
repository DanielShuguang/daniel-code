<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useMessageEvents } from '../../ui-components/DanMessage/composition'
import DanMessageItem from './DanMessageItem.vue'

const showMsgBox = ref(false)

const { messageList, showMessageList } = useMessageEvents()

const showNewMessage = computed(() => !!showMessageList.value.length)
</script>

<template>
  <teleport to="body">
    <div v-if="showMsgBox" v-show="showMsgBox" class="notifications-center">
      <div class="notifications-center-header">
        <div class="header-title">通知</div>
      </div>
      <div class="notifications-list-container">
        <DanMessageItem
          v-for="(opt, i) in messageList"
          :key="opt.key"
          class="notifications-list-row"
          :message-opt="opt"
          @close="messageList.splice(i, 1)"
        />
      </div>
    </div>
    <div v-else-if="showNewMessage" class="new-notifications-list">
      <DanMessageItem
        v-for="(opt, i) in showMessageList.slice(showMessageList.length - 3)"
        :key="opt.key"
        class="notifications-list-row"
        :message-opt="opt"
        @close="messageList.splice(i, 1)"
      />
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.notifications-center,
.new-notifications-list {
  position: fixed;
  right: 16px;
  bottom: 31px;
  width: 500px;
  font-size: 13px;
  z-index: 1111;
}
.notifications-center {
  .notifications-list-container {
    max-height: 300px;
    overflow-y: auto;
  }
}
.new-notifications-list {
  max-height: calc(100vh - 60px);
  overflow: hidden;
}
:deep() .notifications {
  &-list-row {
    margin-bottom: 5px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>
