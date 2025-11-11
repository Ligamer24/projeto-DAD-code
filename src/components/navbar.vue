<script setup>
import {Coins, UserRound} from "lucide-vue-next";

</script>

<template>
  <header class="container mx-auto px-4 pt-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="size-9 rounded-full bg-white/80 border border-black/40 grid place-items-center">
          <UserRound class="size-5 text-emerald-700"/>
        </div>
        <span class="text-lg lg:text-xl font-semibold text-black">Ana</span>
      </div>
      <div class="flex items-center gap-1 text-black">
        <span class="text-lg lg:text-xl font-bold">300</span>
        <Coins class="size-5 lg:size-6 text-yellow-600"/>
      </div>
    </div>
    <div class="mt-2 h-px w-full bg-black/40"/>
  </header>
</template>

<style scoped>

</style>