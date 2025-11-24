import HomePage from "@/pages/index.vue";
import { createRouter, createWebHistory } from "vue-router";
import ProfilePage from "@/pages/profile.vue";
import LoginPage from "@/pages/login/LoginPage.vue";
import RegisterPage from "@/pages/login/RegisterPage.vue";
import { useAuthStore } from "@/stores/auth.js";
import MatchGamePage from "@/pages/dashboard/matchHistory/MatchGamePage.vue";
import GamesPage from "@/pages/dashboard/matchHistory/GamesPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomePage },
    { path: "/shop", name: "shop", component: HomePage },
    { path: "/dashboard", name: "dashboard", component: HomePage },
    { path: "/leaderboard", name: "leaderboard", component: HomePage },
    { path: "/history", name: "history", component: HomePage },
    {
      path: "/profile",
      name: "profile",
      component: ProfilePage,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
      meta: { requiresGuest: true },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterPage,
      meta: { requiresGuest: true },
    },
    {
      path: "/MatchDetails/:id",
      name: "MatchDetails",
      component: MatchGamePage,
    },
    { path: "/GamesPage/:id", name: "GamesPage", component: GamesPage },
    // {
    //     path: "/dashboard",
    //     name: "dashboard",
    //     component: DashboardPage
    // },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: "login" });
  }

  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    next({ name: "dashboard" });
  }

  if (!authStore.isLoggedIn && !authStore.anonymous && !to.meta.requiresGuest) {
    next({ name: "login" });
  }

  if (to.path === "/") return next({ name: "dashboard" });
  next();
});

export default router;
