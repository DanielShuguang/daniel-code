export interface MessageOption {
  type: 'warn' | 'info' | 'error'
  message: string
  timeout?: number
  reasons?: string[]
  closable?: boolean
}

export interface MessageItem extends MessageOption {
  callback?: (reason: string) => void
}
