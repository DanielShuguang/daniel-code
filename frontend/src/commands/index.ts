import { isDev } from '@/utils/env-tools'
import { logger } from '@/utils/logger'
import { MessageCommands } from './message'
import { TopMenuCommands } from './top-menu'

export type CommandTypes = TopMenuCommands & MessageCommands

export class CommandSerivce {
  private static instance: CommandSerivce
  static getInstance = () => {
    if (!CommandSerivce.instance) {
      CommandSerivce.instance = new CommandSerivce()
    }
    return CommandSerivce.instance
  }

  private commands: Map<string | symbol, Function> = new Map()

  /**
   * 命令集合服务（一个on响应多个emit，有返回值）
   */
  private constructor() {}

  registerCommand = <E extends keyof CommandTypes>(cmd: E, fn: CommandTypes[E]) => {
    if (this.commands.has(cmd)) {
      logger.warn(
        `warning: command ${cmd} has been registered, this operation will not take effect.`
      )
      return false
    }
    this.commands.set(cmd, fn)
    return true
  }

  execCommand = async <E extends keyof CommandTypes>(
    cmd: E,
    ...args: Parameters<CommandTypes[E]>
  ): Promise<ReturnType<CommandTypes[E]> | void> => {
    const fn = this.commands.get(cmd)
    if (fn) {
      return fn(...args)
    } else if (isDev) {
      logger.warn(`warning: command "${String(cmd)}" is unregistered.`)
    }
  }

  unregisterCommand = (event: keyof CommandTypes, fn?: Function) => {
    this.commands.delete(event)
  }

  unregisterAll = () => {
    this.commands.clear()
  }
}

export const commandSerivce = CommandSerivce.getInstance()
