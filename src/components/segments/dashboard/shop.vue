<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {ArrowLeft} from 'lucide-vue-next'

const router = useRouter();
const selectedCard = ref(null);

const cards = [
  { id: 1, image: '/src/assets/decks/deck4.png' },
  { id: 2, image: '/src/assets/decks/deck2.png' },
  { id: 3, image: '/src/assets/decks/deck3.png' },
  { id: 4, image: '/src/assets/decks/deck1.png' },
];

function goBack() {
  router.back();
}

function selectCard(id) {
  selectedCard.value = id;
}
</script>

<template>
  <div class="min-h-screen bg-lime-300 p-4">
    <button aria-label="Back to Home"
      class="inline-flex cursor-pointer items-center gap-2 text-black/80 hover:text-black transition mb-4"
      @click="goBack">
      <ArrowLeft class="size-5" />
      <span>Back</span>
    </button>

    <div class="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-xl mx-auto">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-widest text-rose-800 w-full text-center">SHOP</h2>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div v-for="card in cards" :key="card.id"
        class="bg-white bg-opacity-50 rounded-lg p-4 flex flex-col items-center shadow">
        <img :src="card.image" alt="Card" class="w-32 h-32 mb-3 object-contain" />
        <button @click="selectCard(card.id)" :class="selectedCard === card.id ? 'bg-yellow-400' : 'bg-white border'"
          class="px-4 py-1 rounded-full border text-black font-bold">
          {{ selectedCard === card.id ? 'Selected' : 'SELECT' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Aqui podes adicionar animações ou sombras adicionais se quiseres */
</style>
