<template>
  <div 
    class="w-28 aspect-[2/3] overflow-hidden border border-gray-300 rounded-md bg-white shadow transition-transform hover:scale-105"
    :class="{ 'cursor-pointer': isInteractive }"
    @click="handleClick"
  >
    <img 
      :src="imageSrc" 
      :alt="altText" 
      class="w-full h-full object-cover"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  card: { type: Object, required: true },
  isInteractive: { type: Boolean, default: false },
  faceDown: { type: Boolean, default: false }
})

// MUDANÇA 1: Usar kebab-case na definição
const emit = defineEmits(['card-click'])

const imageSrc = computed(() => {
  if (props.faceDown) {
    return '/src/assets/cards/default/semFace.png'
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