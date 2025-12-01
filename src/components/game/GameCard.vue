<template>
  <div 
    class="lg:w-28 md:w-16 w-12 rounded-sm shadow transition-transform"
    :class="{ 'cursor-pointer hover:scale-105': isInteractive }"
    @click="handleClick"
  >
    <img 
      :src="imageSrc" 
      :alt="altText" 
      class="w-full h-full"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {useShopStore} from "@/stores/shop.js";

const props = defineProps({
  card: { type: Object, required: true },
  isInteractive: { type: Boolean, default: false },
  faceDown: { type: Boolean, default: false }
})

const deck = useShopStore().selectedDeck

// MUDANÇA 1: Usar kebab-case na definição
const emit = defineEmits(['card-click'])

const imageSrc = computed(() => {
  if (props.faceDown) {
    return `/src/assets/cards/semFace_${deck}.png`
  }
  return `/src/assets/cards/default/${props.card.card}.png`
})

const altText = computed(() => props.faceDown ? 'Card Back' : props.card.card)

function handleClick() {
  if (props.isInteractive) {
    // Debug: Confirma se o clique está a chegar aqui
    console.log('GameCard clicado:', props.card) 
    
    // MUDANÇA 2: Emitir com kebab-case
    emit('card-click', props.card)
  }
}
</script>