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
import { computed, inject } from 'vue'
import {useShopStore} from "@/stores/shop.js";

const props = defineProps({
  card: { type: Object, required: true },
  isInteractive: { type: Boolean, default: false },
  faceDown: { type: Boolean, default: false }
})

const shopStore = useShopStore()
const baseURL = inject('baseURL')

// MUDANÇA 1: Usar kebab-case na definição
const emit = defineEmits(['card-click'])

const imageSrc = computed(() => {
  if (props.faceDown) {
    const selectedItem = shopStore.items.find(item => item.id === shopStore.selectedDeck)
    
    if (selectedItem) {
        if (selectedItem.isLocal) {
            return selectedItem.image
        } else {
            return selectedItem.image.startsWith('http') ? selectedItem.image : baseURL + selectedItem.image
        }
    }
    
    return '/src/assets/cards/semFace_1.png'
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