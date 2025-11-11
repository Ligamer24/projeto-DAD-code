<script setup>
import {Coins, Crown, Star, UserRound} from "lucide-vue-next";
import {RouterLink} from "vue-router";
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.js'

const user = useUserStore()
const { nickname, coins, rating, rank } = storeToRefs(user)
</script>

<template>
  <header class="container mx-auto px-4 pt-5">
    <div class="flex items-center justify-between gap-4">
      <!-- Profile / Nickname -->
      <RouterLink to="/profile" class="flex items-center gap-2 group" aria-label="Open profile">
        <div class="size-9 rounded-full bg-white/80 border border-black/40 grid place-items-center group-hover:bg-white transition">
          <UserRound class="size-5 text-emerald-700"/>
        </div>
        <span class="text-lg lg:text-xl font-semibold text-black group-hover:underline">{{ nickname }}</span>
      </RouterLink>

      <!-- Rating & Rank -->
      <RouterLink to="/leaderboard" class="flex items-center flex-col leading-tight group" aria-label="Open leaderboard">
        <span class="flex gap-2 text-sm font-semibold text-black">
          <Star class="size-4 text-emerald-700"/>
          Rating: {{ rating }}
        </span>
        <span class="flex gap-2 text-xs text-black/70 group-hover:text-black opacity-80">
          <Crown class="size-4 text-amber-700"/>
          Rank #{{ rank }}
        </span>
      </RouterLink>

      <!-- Coins -->
      <RouterLink to="/shop" class="flex items-center gap-1 text-black">
        <span class="text-lg lg:text-xl font-bold">{{ coins }}</span>
        <Coins class="size-5 lg:size-6 text-yellow-600"/>
      </RouterLink>
    </div>
    <div class="mt-2 h-px w-full bg-black/40"/>
  </header>
</template>

<style scoped>

</style>