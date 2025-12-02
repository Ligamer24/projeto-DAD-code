<template>
  <div>
    <div ref="gameDiv" class="flex flex-col justify-between p-3 box-border">
      <div class="flex flex-wrap gap-2 justify-center">
        <div
            v-for="(card, i) in topImages"
            :key="'top-' + i"
            class="w-28 overflow-hidden border border-gray-300 rounded-md bg-white shadow"
        >
          <img :src="card" :alt="'Top card ' + i" class="w-full h-full object-cover"/>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 justify-around">
        <div class="flex flex-col gap-2">
          <img ref="playedCardOpponent" src="" class="w-28 object-cover op"/>
          <img ref="playedCardSelf" src="" class="w-28 object-cover el"/>
        </div>
        <div class="relative w-28 h-40">
          <img :src="trunfoCard" class="absolute inset-0 w-full h-full object-cover z-0" alt="trunfo"/>
          <img :src="`/src/assets/cards/semFace_${deck}.png`" alt="Deck"
               class="absolute inset-0 w-full h-full object-cover rotate-90 z-10 top-16"/>
          <p class="absolute inset-0 w-full h-full object-cover z-20 top-32 text-3xl font-bold text-center">{{ game.deck.length }} left</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 justify-center">
        <div
            v-for="(card, i) in bottomImages"
            :key="'bottom-' + i"
            @click="playCard(game.player1Hand[i], i)"
            class="w-28 overflow-hidden border border-gray-300 rounded-md bg-white shadow cursor-pointer"
        >
          <img :src="card" :alt="'Bottom card ' + i" class="w-full h-full object-cover"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useGameStore} from "@/stores/game.js";
import {useShopStore} from "@/stores/shop.js";

const gameDiv = ref(null);
const deck = ref();
deck.value = useShopStore().selectedDeck;

function updatePagesHeight() {
  if (typeof window === 'undefined') return
  const h = window.innerHeight
  const headerH = document.getElementsByTagName('header')[0]?.offsetHeight || 0
  const available = Math.max(0, h - headerH)
  if (gameDiv.value) {
    gameDiv.value.style.height = available + 'px'
  }
}

onMounted(() => {
  updatePagesHeight()
})

window.addEventListener('resize', updatePagesHeight)


const game = useGameStore();
game.shuffle();

game.getFirstCardsToHands();
game.getTrunfoCard();

const topImages = computed(() => game.player1Hand.map(card => `/src/assets/cards/default/${card.card}.png`));
const bottomImages = computed(() => game.player2Hand.map(card => `/src/assets/cards/default/${card.card}.png`));
const trunfoCard = computed(() => `/src/assets/cards/default/${game.trunfo.card}.png`);

const playedCardOpponent = ref(null);
const playedCardSelf = ref(null);

function playCard(card, cardIndex) {
  playedCardSelf.value.src = `/src/assets/cards/default/${card.card}.png`;
  playedCardOpponent.value.src = `/src/assets/cards/default/${game.player2Hand[Math.floor(Math.random() * 9)].card}.png`;

}

</script>
