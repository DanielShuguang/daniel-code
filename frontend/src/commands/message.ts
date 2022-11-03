import { MessageOption } from '@/components/DanMessage/types'

export interface MessageCommands {
  'dan-code-message': (opt: MessageOption, callback?: (reason: string) => void) => string | void
}
