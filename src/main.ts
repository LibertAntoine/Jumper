import './assets/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'

import App from './App.vue'

import router from './router'

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        retry: 0,
        refetchOnWindowFocus: false
      }
    }
  }
}

const app = createApp(App)

app.use(createPinia())
app.use(VueQueryPlugin, vueQueryPluginOptions)
app.use(router)
app.mount('#app')
