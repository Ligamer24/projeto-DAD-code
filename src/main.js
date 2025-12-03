import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'

// const BASE_URL = 'http://localhost:8000'
const BASE_URL = 'https://redycore.dpdns.org'
const API_BASE_URL = BASE_URL + '/api'
const VAPID_PUBLIC_KEY = 'BIGLFVMdgB0i65VHkKWD7IygUUQoZJ8JEUmdTPDUGLxL1nAOI6zIi_36ukf2YCm-I0PzU2fE2tqQtIhkSKBXgtg'

const app = createApp(App)

app.provide('baseURL', BASE_URL)
app.provide('apiBaseURL', API_BASE_URL)
app.provide('vapidPublicKey', VAPID_PUBLIC_KEY)
app.use(createPinia())
app.use(router)

app.mount('#app')
