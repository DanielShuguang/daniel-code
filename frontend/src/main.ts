import App from './App.vue'
import { mountDirectives } from './directives'

import './assets/styles/index.scss'

const app = createApp(App)
app.use(createPinia())
mountDirectives(app)

app.mount('#app')
