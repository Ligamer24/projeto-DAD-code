import LoginPage from "@/pages/login/LoginPage.vue";
import RegisterPage from "@/pages/login/RegisterPage.vue";
import DashboardPage from "@/pages/dashboard/DashboardPage.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
});

export default router;
