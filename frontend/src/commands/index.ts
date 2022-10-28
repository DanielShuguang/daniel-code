import { EventBus } from '@/utils/event-bus'
import { TopMenuCommands } from './top-menu'

export type CommandTypes = TopMenuCommands

const emitter = new EventBus()

export type ExecCommandFn = <E extends keyof CommandTypes>(
  event: E,
  ...args: Parameters<CommandTypes[E]>
) => Promise<ReturnType<CommandTypes[E]>>

export type RegisterCommandFn = <E extends keyof CommandTypes>(
  event: E,
  fn: CommandTypes[E]
) => void

/**
 * 执行触发事件
 * @param event
 * @param args
 * @returns
 */
export const execCommand: ExecCommandFn = async (event, ...args) => {
  return emitter.emit(event, ...args)
}

/**
 * 注册事件
 * @param event
 * @param fn
 */
export const registerCommand: RegisterCommandFn = (event, fn) => {
  emitter.on(event, fn)
}

/**
 * 注销事件
 * @param events
 */
export const unregisterCommand = (...events: (keyof CommandTypes)[]) => {
  events.forEach(ev => {
    emitter.off(ev)
  })
}
