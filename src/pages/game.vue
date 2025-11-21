<template>
  <div>
    <div class="flex flex-col justify-between min-h-96 p-3 box-border">
      <div class="flex flex-wrap gap-2 justify-center">
        <div
          v-for="(card, i) in topImages"
          :key="'top-' + i"
          class="w-28 overflow-hidden border border-gray-300 rounded-md bg-white shadow"
        >
          <img :src="card" :alt="'Top card ' + i" class="w-full h-full object-cover" />
        </div>
      </div>
      <div class="flex flex-wrap gap-2 justify-center">
        <div
          v-for="(card, i) in bottomImages"
          :key="'bottom-' + i"
          class="w-28 overflow-hidden border border-gray-300 rounded-md bg-white shadow"
        >
          <img :src="card" :alt="'Bottom card ' + i" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from "@/stores/game.js";

const game = useGameStore();
game.shuffle();

game.getFirstCardsToHands();

const topImages = computed(() => game.player1Hand.map(card => `/src/assets/cards/default/${card.card}.png`));
const bottomImages = computed(() => game.player2Hand.map(card => `/src/assets/cards/default/${card.card}.png`));

</script>
