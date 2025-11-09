<script setup>
import {ShoppingCart, Gamepad2, BarChart2, RotateCcw, Coins, UserRound} from 'lucide-vue-next'
</script>

<template>
  <!-- Responsive website container: mobile-first full-screen gradient; desktop two-column -->
  <div class="min-h-svh w-full bg-gradient-to-b from-lime-300 to-yellow-300">
    <!-- Header -->
    <header class="container mx-auto px-4 pt-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="size-9 rounded-full bg-white/80 border border-black/40 grid place-items-center">
            <UserRound class="size-5 text-emerald-700" />
          </div>
          <span class="text-lg lg:text-xl font-semibold text-black">Ana</span>
        </div>
        <div class="flex items-center gap-1 text-black">
          <span class="text-lg lg:text-xl font-bold">300</span>
          <Coins class="size-5 lg:size-6 text-yellow-600" />
        </div>
      </div>
      <div class="mt-2 h-px w-full bg-black/40" />
    </header>

    <!-- Main content -->
    <main class="container mx-auto px-4 pb-24 lg:pb-10">
      <section class="mt-6 lg:mt-12 grid place-items-center gap-8 lg:grid-cols-2">
        <!-- Logo + title -->
        <div class="flex flex-col items-center lg:items-start text-center lg:text-left select-none">
          <img src="../assets/logo.png" alt="Bisca Royal logo" class="" />
        </div>

        <!-- CTAs -->
        <div class="flex flex-col items-center gap-5 w-full">
          <button
            type="button"
            class="w-64 sm:w-72 lg:w-80 rounded-md border-2 border-black bg-gradient-to-b from-gray-200 to-gray-400 px-6 py-3 lg:py-4 text-xl lg:text-2xl font-extrabold text-black shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgba(0,0,0,0.6)]"
          >
            Singleplayer
          </button>
          <button
            type="button"
            class="w-64 sm:w-72 lg:w-80 rounded-md border-2 border-black bg-gradient-to-b from-gray-200 to-gray-400 px-6 py-3 lg:py-4 text-xl lg:text-2xl font-extrabold text-black shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgba(0,0,0,0.6)]"
          >
            Multiplayer
          </button>
        </div>
      </section>
    </main>

    <!-- Bottom nav: fixed on mobile, in-flow on desktop -->
    <nav class="fixed bottom-0 left-0 right-0 px-8 pb-5 pt-2 bg-gradient-to-t from-black/10 to-transparent backdrop-blur-sm lg:static lg:bg-transparent lg:px-0">
      <div class="container mx-auto">
        <div class="hidden lg:block h-px w-full bg-black/40 mb-3" />
        <div class="mx-auto max-w-xl flex items-center justify-between text-black">
          <button aria-label="Store" class="grid place-items-center size-12 rounded-full bg-black/5 hover:bg-black/10 transition">
            <ShoppingCart class="size-6" />
          </button>
          <button aria-label="Games" class="grid place-items-center size-12 rounded-full bg-black/5 hover:bg-black/10 transition">
            <Gamepad2 class="size-6" />
          </button>
          <button aria-label="Leaderboard" class="grid place-items-center size-12 rounded-full bg-black/5 hover:bg-black/10 transition">
            <BarChart2 class="size-6" />
          </button>
          <button aria-label="History" class="grid place-items-center size-12 rounded-full bg-black/5 hover:bg-black/10 transition">
            <RotateCcw class="size-6" />
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>
