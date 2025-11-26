import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'

const BASE_URL = 'http://localhost:8000'
// const BASE_URL = 'https://redycore.dpdns.org'
const API_BASE_URL = BASE_URL + '/api'

const app = createApp(App)

app.provide('baseURL', BASE_URL)
app.provide('apiBaseURL', API_BASE_URL)
app.use(createPinia())
app.use(router)

app.mount('#app')
