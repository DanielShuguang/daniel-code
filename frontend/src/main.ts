import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { mountDirectives } from './directives'

import './assets/styles/index.scss'
import { registerPlugins } from './plugins'

const app = createApp(App)
app.use(createPinia())
mountDirectives(app)
registerPlugins(app)

app.mount('#app')
