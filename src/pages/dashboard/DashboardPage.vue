<template>
  <div
    class="min-h-screen w-full bg-gradient-to-b from-lime-300 to-yellow-300 flex flex-col items-center justify-center p-6"
  >
    <h1 class="">Dashboard Page</h1>
    <p>User Details:</p>
    <div v-if="authStore.isLoggedIn">
      <p class="text-lg font-semibold mb-2">
        {{ authStore.currentUser?.name }}
      </p>
      <p
        v-for="(field, key) in authStore.currentUser"
        :key="key"
        class="text-sm text-gray-700"
      >
        <span class="font-medium">{{ key }}</span
        >: {{ field }}
      </p>
    </div>
    <div v-else>
      <p class="text-lg font-medium text-gray-500">Anonymous User</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
</script>
