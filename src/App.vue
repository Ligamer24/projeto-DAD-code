<template>
  <Toaster/>
  <div class="min-h-svh w-full bg-lime-300">
    <Navbar v-if="authStore.currentUser || authStore.anonymous"/>
    <router-view></router-view>
  </div>
</template>
<script setup>
import {Toaster} from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import {RouterView} from 'vue-router';
import Navbar from "@/components/navbar.vue";

import {useAuthStore} from "@/stores/auth";

const authStore = useAuthStore();
</script>
<style></style>
