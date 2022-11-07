import { App } from 'vue'
import FileExplorer from './FileExplorer.vue'

export const registerPlugins = (app: App) => {
  app.component(FileExplorer.name, FileExplorer)
}
