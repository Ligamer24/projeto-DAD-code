import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'

const BASE_URL = (typeof window !== 'undefined' && window.location && window.location.origin)
  ? window.location.origin.replace(":5173", ":8000")
  : 'http://localhost:8000'



const API_BASE_URL = BASE_URL + '/api'

const app = createApp(App)

app.provide('baseURL', BASE_URL)
app.provide('apiBaseURL', API_BASE_URL)
app.use(createPinia())
app.use(router)

app.mount('#app')
