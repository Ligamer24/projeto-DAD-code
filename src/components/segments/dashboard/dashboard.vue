<template>
  <section
      class="snap-start snap-always w-full shrink-0 px-4 mt-6 lg:mt-12"
  >
    <div class="grid place-items-center gap-8 lg:grid-cols-2">
      <div class="flex flex-col items-center lg:items-start text-center lg:text-left select-none">
        <img src="@/assets/logo.png" alt="Bisca Royal logo"/>
      </div>
      <div class="flex flex-col items-center gap-5 w-full">
        <RouterLink to="/play"
            type="button"
            class="cursor-pointer w-64 sm:w-72 lg:w-80 rounded-md border-2 border-black bg-gradient-to-b from-gray-200 to-gray-400 px-6 py-3 lg:py-4 text-xl lg:text-2xl font-extrabold text-black shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgba(0,0,0,0.6)]"
        >
<!--          Singleplayer-->
          Start Game
        </RouterLink>
<!--        <button-->
<!--            type="button"-->
<!--            class="cursor-pointer w-64 sm:w-72 lg:w-80 rounded-md border-2 border-black bg-gradient-to-b from-gray-200 to-gray-400 px-6 py-3 lg:py-4 text-xl lg:text-2xl font-extrabold text-black shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgba(0,0,0,0.6)]"-->
<!--        >-->
<!--          Multiplayer-->
<!--        </button>-->
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import {RouterLink} from "vue-router";
</script>