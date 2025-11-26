<template>
  <div class="flex flex-wrap gap-2 md:gap-8 justify-around items-center py-4 w-full max-w-7xl">

    <div class="flex flex-col gap-2 items-center justify-center">
      <div v-if="opponentPlayedCard">
         <GameCard :card="opponentPlayedCard" />
      </div>
      <div v-else class="md:w-28 md:h-40 w-12 h-18 border-2 border-dashed border-neutral-500 text-neutral-500 rounded-md flex items-center justify-center opacity-70">
        <span class="text-xs hidden md:block">Opponent</span>
      </div>

      <div v-if="playerPlayedCard">
        <GameCard :card="playerPlayedCard" />
      </div>
      <div v-else class="md:w-28 md:h-40 w-12 h-18 border-2 border-dashed border-neutral-500 text-neutral-500 rounded-md flex items-center justify-center opacity-70">
        <span class="text-xs hidden md:block">You</span>
      </div>
    </div>

    <div class="relative w-28 h-40 md:w-32 md:h-48 flex items-center justify-center">
      <img
        v-if="trunfo"
        :src="`/src/assets/cards/default/${trunfo.card}.png`"
        :class="['absolute w-12 md:w-full md:h-full z-0 md:-top-5', { 'opacity-30': trunfo && trunfo.used }]"
        alt="trunfo"
      />
      
      <div class="absolute z-10 md:w-full top-8 transition-transform hover:-translate-y-2 w-12">
         <img
            src="/src/assets/cards/default/semFace.png" 
            alt="Deck"
            class="w-full h-full rounded-sm shadow-lg rotate-90"
         />
         <p class="absolute inset-0 flex items-center justify-center font-extrabold text-white md:text-6xl text-xl drop-shadow-md">
           {{ deckCount }}
         </p>
      </div>
    </div>

    <div class="flex flex-col gap-2 md:min-w-[120px] items-center justify-center">

      <div class="md:w-28 md:h-40 w-12 h-18 flex flex-col items-center justify-center bg-white/50 border-2 border-red-100 rounded-md shadow-sm">
        <span class="text-xs md:font-bold text-gray-400 uppercase tracking-widest mb-2">Score</span>
        <span class="md:text-5xl text-xl font-black text-red-600">{{ opponentScore ?? -1 }}</span>
        <span class="text-xs text-red-400 mt-1 font-medium">pts</span>
      </div>

      <div class="md:w-28 md:h-40 w-12 h-18 flex flex-col items-center justify-center bg-white/50 border-2 border-green-100 rounded-md shadow-sm">
        <span class="text-xs md:font-bold text-gray-400 uppercase tracking-widest mb-2">Score</span>
        <span class="md:text-5xl text-xl font-black text-green-600">{{ playerScore ?? -1 }}</span>
        <span class="text-xs text-green-400 mt-1 font-medium">pts</span>
      </div>

    </div>

    <div class="flex flex-col gap-2 md:min-w-[120px] items-center justify-center">

      <div class="md:w-28 md:h-40 w-12 h-18 flex items-center justify-center">
        <div v-if="lastOpponentCard" class="w-full h-full opacity-80 hover:opacity-100 transition-opacity">
           <GameCard :card="lastOpponentCard" />
        </div>
        <div v-else class="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-md">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Last<br>Round</span>
        </div>
      </div>

      <div class="md:w-28 md:h-40 w-12 h-18 flex items-center justify-center">
        <div v-if="lastPlayerCard" class="w-full h-full opacity-80 hover:opacity-100 transition-opacity">
           <GameCard :card="lastPlayerCard" />
        </div>
        <div v-else class="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-md">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Last<br>Round</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import GameCard from './GameCard.vue'

defineProps({
  trunfo: Object,
  deckCount: Number,
  playerPlayedCard: Object,
  opponentPlayedCard: Object,
  opponentScore: Number,
  playerScore: Number,
  lastOpponentCard: Object,
  lastPlayerCard: Object
})
</script>