<template>
  <div class="flex justify-center items-center h-full">
    <div class="bg-white rounded-lg shadow-lg p-8 text-center max-w-sm relative">
      <Spade class="text-2xl absolute top-2 left-2" />
      <h2 class="text-red-500 text-xl font-bold my-4">You're Playing Anonymously</h2>
      <p class="text-gray-600 mb-6">To unlock your full game experience, please log in.</p>
      <button @click="gotoLogin"  class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Log In</button>
      <Heart class="text-2xl absolute bottom-2 right-2" />
    </div>
  </div>
</template>

<script setup>
import { Spade, Heart } from 'lucide-vue-next'
import {useAuthStore} from "@/stores/auth.js";
import router from "@/router/index.js";

const authStore = useAuthStore();

function gotoLogin() {
  router.push({ name: 'login' });
}
</script>
