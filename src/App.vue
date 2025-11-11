<template>
  <Toaster />
  <nav class="max-w-full p-5 flex flex-row justify-between align-middle" v-if="authStore.currentUser">
    <div class="align-middle text-xl">
      <RouterLink to="/"> ♠️♥️♣️♦️ Bisca Royal</RouterLink>
      <span class="text-xs" v-if="authStore.currentUser">&nbsp;&nbsp;&nbsp;
            ({{ authStore.currentUser?.name }})
      </span>
    </div>
    <NavigationMenu>
      <NavigationMenuList class="justify-around gap-20">
        <NavigationMenuItem>
          <NavigationMenuLink>
            <RouterLink to="/about">About</RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem v-if="!authStore.isLoggedIn">
          <NavigationMenuLink>
            <RouterLink to="/login">Login</RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem v-else>
          <NavigationMenuLink>
            <a @click.prevent="logout">Logout</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </nav>
  <div class="align-middle text-xl">
    <span class="text-xs" v-if="authStore.currentUser"
      >&nbsp;&nbsp;&nbsp; ({{ authStore.currentUser?.name }})
    </span>
  </div>

  <div>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>
<script setup>
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'vue-sonner'
import 'vue-sonner/style.css'
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  toast.promise(authStore.logout(), {
    loading: 'Calling API',
    success: () => {
      router.push("/login")
      return 'Logout Sucessfull '
    },
    error: (data) => `[API] Error logout - ${data?.response?.data?.message}`,
  })
}
</script>
<style></style>
