<script lang="ts" setup>
import { useCommandService } from '@/commands'
import { codicon } from '@/utils/codicon'
import { useMessageEvents } from './composition'
import MessageItem from './MessageItem.vue'

const showMsgBox = ref(false)

const { messageList, showMessageList } = useMessageEvents()
useCommandService('dan-code-open-message-box', () => {
  messageList.value.forEach(el => (el.show = false))
  showMsgBox.value = !showMsgBox.value
})
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

const closeMessageCenter = () => {
  if (showNewMessage.value) {
    messageList.value.forEach(el => {
      if (el.show) {
        el.show = false
      }
    })
  }
  showMsgBox.value = false
}
</script>

<template>
  <teleport to="body">
    <div v-if="showMsgBox" v-show="showMsgBox" class="notifications-center">
      <div class="notifications-center-header">
        <div class="header-title">通知</div>
        <div class="header-toolbar">
          <ul class="actions-container">
            <li class="action-item">
              <a :class="['action-label', codicon('notifications-clear-all')]"></a>
            </li>
            <li class="action-item">
              <a :class="['action-label', codicon('notifications-do-not-disturb')]"></a>
            </li>
            <li class="action-item">
              <a
                :class="['action-label', codicon('notifications-hide')]"
                @click="closeMessageCenter"
              ></a>
            </li>
          </ul>
        </div>
      </div>
      <div class="notifications-list-container">
        <MessageItem
          v-for="(opt, i) in messageList"
          :key="opt.key"
          class="notifications-list-row"
          :message-opt="opt"
          @close="messageList.splice(i, 1)"
        />
      </div>
    </div>
    <div v-else-if="showNewMessage" class="new-notifications-list">
      <MessageItem
        v-for="opt in showMessageList.slice(
          showMessageList.length > 3 ? showMessageList.length - 3 : 0
        )"
        :key="opt.key"
        class="notifications-list-row"
        :message-opt="opt"
        auto-close
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
  .notifications-list-row {
    margin: 6px;
  }
}
.notifications-center-header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 35px;
  padding-left: 8px;
  padding-right: 5px;
  background: var(--message-header-background);
  .header-toolbar {
    flex: 1;
    height: 100%;
    .actions-container {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      height: 100%;

      .action-item {
        margin-right: 4px;

        &:first-of-type {
          margin-left: 4px;
        }
      }
      .action-label {
        width: 16px;
        height: 16px;
        font-size: 16px;
        cursor: pointer;

        &:hover {
          background-color: var(--top-menu-hoverbackground);
        }
      }
    }
  }
}
.notifications-center {
  box-shadow: rgb(0 0 0 / 36%) 0px 0px 8px 2px;
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
