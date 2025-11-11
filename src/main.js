import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'

const API_BASE_URL = 'http://localhost:8000/api'

const app = createApp(App)

app.provide('apiBaseURL', API_BASE_URL)
app.use(createPinia())
app.use(router)

app.mount('#app')
