<template>
  <div 
    class="w-28 aspect-[2/3] overflow-hidden border border-gray-300 rounded-md bg-white shadow transition-transform hover:scale-105"
    :class="{ 'cursor-pointer': true }"
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
  card: {
    type: Object,
    required: true // Espera o objeto carta { suit, rank, card: 'nome_arquivo', etc }
  },
  
  faceDown: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cardClick'])

// Lógica da imagem centralizada aqui
const imageSrc = computed(() => {
  if (props.faceDown) {
    return '/src/assets/cards/default/semFace.png' // Ajusta o caminho se necessário
  }
  return `/src/assets/cards/default/${props.card.card}.png`
})

const altText = computed(() => props.faceDown ? 'Card Back' : props.card.card)

function handleClick() {
  if (props.isInteractive) {
    emit('cardClick', props.card)
  }
}
</script>