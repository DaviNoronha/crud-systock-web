/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
pinia.use(({store}) => {
    store.router = markRaw(router)
})

app.use(pinia)

registerPlugins(app)

app.mount('#app')
