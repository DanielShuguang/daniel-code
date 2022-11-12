import { MessageOption } from '@/components/MessageBox/types'

export interface MessageCommands {
  'dan-code-message': (opt: MessageOption) => void
}
