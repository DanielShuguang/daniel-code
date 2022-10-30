import { App } from 'vue'
import { command } from './command'
import { uncontext } from './uncontext'
import { windrag } from './windrag'

export const mountDirectives = (app: App<Element>) => {
  app.directive('windrag', windrag)
  app.directive('uncontext', uncontext)
  app.directive('command', command)
}
