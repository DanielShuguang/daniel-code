import { BottomTool } from '@/types/bottom-tool'
import MessageBottomTool from '@/widgets/MessageBottomTool.vue'
import { h } from 'vue'

export const bottomTools: BottomTool[] = [
  {
    name: '消息',
    key: 'bottom-message-tool-btn',
    component: h(MessageBottomTool),
    position: 'right'
  }
]
