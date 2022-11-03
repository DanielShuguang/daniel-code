export interface MessageOption {
  type: 'warn' | 'info' | 'error'
  message: string
  timeout?: number
  reasons?: string[]
  closable?: boolean
  /**
   * 点击按钮后的回调
   * @param reason 点击按钮的文字内容
   */
  callback?: (reason: string) => void
}
