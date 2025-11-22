<template>
  <div class="flex flex-wrap gap-8 justify-center items-center py-4">
    
    <div class="flex flex-col gap-2 min-w-[120px] items-center justify-center">
      <div v-if="opponentPlayedCard" class="w-28">
         <GameCard :card="opponentPlayedCard" />
      </div>
      <div v-else class="w-28 h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center opacity-50">
        <span class="text-xs">Opponent</span>
      </div>

      <div v-if="playerPlayedCard" class="w-28">
        <GameCard :card="playerPlayedCard" />
      </div>
      <div v-else class="w-28 h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center opacity-50">
        <span class="text-xs">You</span>
      </div>
    </div>

    <div class="relative w-28 h-40 ml-8">
      <img 
        v-if="trunfo"
        :src="`/src/assets/cards/default/${trunfo.card}.png`" 
        class="absolute inset-0 w-full h-full object-cover z-0 rounded-md brightness-90" 
        alt="trunfo"
      />
      
      <div class="absolute inset-0 z-10 top-8 left-4 transition-transform hover:-translate-y-2">
         <img 
            src="/src/assets/cards/default/semFace.png" 
            alt="Deck"
            class="w-full h-full object-cover rounded-md shadow-lg rotate-90"
         />
         <p class="absolute inset-0 flex items-center justify-center font-bold text-white text-2xl drop-shadow-md -rotate-90">
           {{ deckCount }}
         </p>
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
  opponentPlayedCard: Object
})
</script>