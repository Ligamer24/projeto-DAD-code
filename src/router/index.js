import LoginPage from '@/pages/login/LoginPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: "/login", 
    name: "login",
    component: LoginPage
  }],
})

export default router
