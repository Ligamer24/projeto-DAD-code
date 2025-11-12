import HomePage from '@/pages/index.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ProfilePage from '@/pages/profile.vue'
import LoginPage from "@/pages/login/LoginPage.vue";
import RegisterPage from "@/pages/login/RegisterPage.vue";
import DashboardPage from "@/pages/dashboard/DashboardPage.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/shop', name: 'shop', component: HomePage },
    { path: '/dashboard', name: 'dashboard', component: HomePage },
    { path: '/leaderboard', name: 'leaderboard', component: HomePage },
    { path: '/history', name: 'history', component: HomePage },
    { path: '/profile', name: 'profile', component: ProfilePage },
      {
          path: "/login",
          name: "login",
          component: LoginPage,
      },
      {
          path: "/register",
          name: "register",
          component: RegisterPage,
      },
      {
          path: "/dashboard",
          name: "dashboard",
          component: DashboardPage
      },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.path === '/') return next({ name: 'dashboard' })
  next()
})

export default router;
