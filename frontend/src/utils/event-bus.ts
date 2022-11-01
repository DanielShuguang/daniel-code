import { isDev } from './env-tools'
import { logger } from './logger'

export class EventBus {
  private eventList: Map<string | symbol, Function>

  /**
   * 事件总线
   */
  constructor() {
    this.eventList = new Map()
  }

  on = (event: string | symbol, fn: Function) => {
    this.eventList.set(event, fn)
  }

  emit = async (event: string | symbol, ...args: any[]) => {
    const fn = this.eventList.get(event)
    if (fn) {
      return fn(...args)
    } else if (isDev) {
      logger.warn(`warning: event "${String(event)}" is unregistered.`)
    }
  }

  off = (event: string | symbol) => {
    this.eventList.delete(event)
  }

  clear = () => {
    this.eventList.clear()
  }
}
