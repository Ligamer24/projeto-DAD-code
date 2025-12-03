<script setup>
import {useRouter} from 'vue-router';
import {ArrowLeft} from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue';
import { useShopStore } from '@/stores/shop';
import {onMounted} from "vue";

const router = useRouter();
const shopStore = useShopStore();

const cards = [
  {id: 1, front: '/src/assets/cards/default/c2.png', back1: '/src/assets/cards/semFace_1.png', back2: '/src/assets/cards/semFace_1.png'},
  {id: 2, front: '/src/assets/cards/default/c2.png', back1: '/src/assets/cards/semFace_2.png', back2: '/src/assets/cards/semFace_2.png'},
  {id: 3, front: '/src/assets/cards/default/c2.png', back1: '/src/assets/cards/semFace_3.png', back2: '/src/assets/cards/semFace_3.png'},
  {id: 4, front: '/src/assets/cards/default/c2.png', back1: '/src/assets/cards/semFace_4.png', back2: '/src/assets/cards/semFace_4.png'},
];

function goBack() {
  router.back();
}

function selectCard(id) {
  shopStore.setSelectedDeck(id);
}
</script>

<template>
  <div class="min-h-screen bg-lime-300 p-4">

    <div class="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-xl mx-auto">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-widest text-rose-800 w-full text-center">SHOP</h2>
    </div>

    <div class="grid grid-cols-2 gap-4 mt-4">
      <div v-for="card in cards" :key="card.id"
           class="bg-white/10 rounded-lg p-4 m-2 flex flex-col items-center shadow">
        <div class="flex flex-wrap justify-center p-2 -space-x-10 overflow-visible">
          <img :src="card.back1" alt="Back 1" class="w-20 -rotate-12"/>
          <img :src="card.front" alt="Front" class="w-20 z-10"/>
          <img :src="card.back2" alt="Back 2" class="w-20 rotate-12 z-20"/>
        </div>
        <Button @click="selectCard(card.id)"
                :class="[
          'px-4 py-1 rounded-full border text-black font-bold min-w-24 text-center cursor-pointer',
          'transition-colors duration-150',
          'focus:outline-none',
          shopStore.selectedDeck === card.id
            ? 'bg-yellow-400 hover:bg-yellow-400'
            : 'bg-white border hover:bg-gray-100'
        ]">
          {{ shopStore.selectedDeck === card.id ? 'Selected' : 'Select' }}
        </Button>
      </div>
    </div>
  </div>
</template>