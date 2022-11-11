<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useMessageEvents } from './composition'
import DanMessageItem from './DanMessageItem.vue'

const showMsgBox = ref(false)

const { messageList, showMessageList } = useMessageEvents()
useEventListener('keydown', ev => {
  if (ev.key === 'Escape') {
    showMsgBox.value = false
    messageList.value.forEach(el => {
      el.show = false
    })
  }
})

const showNewMessage = computed(() => !!showMessageList.value.length)

const deleteMessage = (key: string) => {
  const index = messageList.value.findIndex(el => el.key === key)
  if (index > -1) {
    messageList.value.splice(index, 1)
  }
}
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
        v-for="opt in showMessageList.slice(
          showMessageList.length > 3 ? showMessageList.length - 3 : 0
        )"
        :key="opt.key"
        class="notifications-list-row"
        :message-opt="opt"
        @close="deleteMessage(opt.key)"
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
