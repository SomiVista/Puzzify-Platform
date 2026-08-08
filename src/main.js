import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import { APP_NAME } from './config/app'

// The product name lives in exactly one module; the tab title follows it.
document.title = APP_NAME

const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.use(router)
app.mount('#app')
