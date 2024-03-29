import { logger } from '@/utils/logger'

export type EventTypes = {}

class EventService {
  private static instance: EventService
  static getInstance = () => {
    if (!EventService.instance) {
      EventService.instance = new EventService()
    }
    return EventService.instance
  }

  private eventList: Map<string | symbol, Function[]> = new Map()

  /**
   * 事件总线（多个on响应多个emit，无返回值）
   */
  private constructor() {}

  on = <E extends keyof EventTypes>(event: E, fn: EventTypes[E]) => {
    const fns = this.eventList.get(event) || []
    fns.push(fn)
  }

  emit = async <E extends keyof EventTypes>(event: E, ...args: Parameters<EventTypes[E]>) => {
    const fns = this.eventList.get(event)
    if (fns?.length) {
      fns.forEach(fn => fn(...args))
    } else {
      logger.warn(`warning: event "${String(event)}" is unregistered.`, false)
    }
  }

  off = <K extends keyof EventTypes>(event: K, fn?: Function) => {
    if (fn) {
      const fns = this.eventList.get(event) || []
      const index = fns.findIndex(f => f === fn)
      if (index !== -1) {
        fns.splice(index, 1)
        this.eventList.set(event, fns)
      }
    } else {
      this.eventList.delete(event)
    }
  }

  clear = () => {
    this.eventList.clear()
  }
}

export const eventService = EventService.getInstance()

export const useEventBus = <E extends keyof EventTypes>(event: E, fn: EventTypes[E]) => {
  onMounted(() => {
    eventService.on(event, fn)
  })

  onUnmounted(() => {
    eventService.off(event, fn)
  })
}
