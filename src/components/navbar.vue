<script setup>
import {Coins, UserRound} from "lucide-vue-next";
import {RouterLink} from "vue-router";
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.js'

const user = useUserStore()
const { nickname, coins } = storeToRefs(user)
</script>

<template>
  <header class="container mx-auto px-4 pt-5">
    <div class="flex items-center justify-between">
      <RouterLink to="/profile" class="flex items-center gap-2 group" aria-label="Open profile">
        <div class="size-9 rounded-full bg-white/80 border border-black/40 grid place-items-center group-hover:bg-white transition">
          <UserRound class="size-5 text-emerald-700"/>
        </div>
        <span class="text-lg lg:text-xl font-semibold text-black group-hover:underline">{{ nickname }}</span>
      </RouterLink>
      <div class="flex items-center gap-1 text-black">
        <span class="text-lg lg:text-xl font-bold">{{ coins }}</span>
        <Coins class="size-5 lg:size-6 text-yellow-600"/>
      </div>
    </div>
    <div class="mt-2 h-px w-full bg-black/40"/>
  </header>
</template>

<style scoped>

</style>