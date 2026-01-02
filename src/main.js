import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { io } from 'socket.io-client'

import App from './App.vue'
import router from './router'
import './assets/main.css'

let BASE_URL = import.meta.env.VITE_API_DOMAIN
let WS_URL = import.meta.env.VITE_WS_CONNECTION

const API_BASE_URL = BASE_URL + '/api'

const app = createApp(App)

const socket = io(WS_URL)

app.provide('baseURL', BASE_URL)
app.provide('apiBaseURL', API_BASE_URL)
app.provide('wsURL', WS_URL)
app.provide('socket', socket)
app.use(createPinia())
app.use(router)

app.mount('#app')
