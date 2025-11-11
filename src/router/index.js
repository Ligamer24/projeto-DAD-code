import HomePage from '@/pages/index.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ProfilePage from '@/pages/profile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/profile', name: 'profile', component: ProfilePage },
  ],
})

export default router
