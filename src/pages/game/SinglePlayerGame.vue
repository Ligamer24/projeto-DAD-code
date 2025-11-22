<template>
  <div class="flex flex-col justify-between p-3 box-border h-dvh w-full">
    
    <section class="flex flex-wrap gap-2 justify-center p-2">
      <GameCard 
        v-for="(card, i) in game.player1Hand" 
        :key="'top-' + i"
        :card="card"
        :face-down="true" 
      />
      </section>

    <section class="flex-grow flex items-center justify-center">
      <GameBoard 
        :trunfo="game.trunfo"
        :deck-count="game.deck.length"
        :player-played-card="playedCardSelf"
        :opponent-played-card="playedCardOpponent"
      />
    </section>

    <section class="flex flex-wrap gap-[-2rem] justify-center p-4 pb-8">
      <GameCard 
        v-for="(card, i) in game.player2Hand" 
        :key="'bottom-' + i"
        :card="card"
        :is-interactive="true"
        @card-click="handlePlayCard(card, i)"
        class="hover:-translate-y-4 transition-transform duration-200"
      />
    </section>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useGameStore } from "@/stores/game.js"
import GameCard from '@/components/game/GameCard.vue'
import GameBoard from '@/components/game/GameBoard.vue'

const game = useGameStore()

// Estado local apenas para animação visual das cartas jogadas
const playedCardSelf = ref(null)
const playedCardOpponent = ref(null)

onMounted(() => {
  // Inicialização do jogo
  game.shuffle()
  game.getFirstCardsToHands()
  game.getTrunfoCard()
})

function handlePlayCard(card, index) {
  // Atualiza o estado reativo (Vue detecta a mudança e passa para o TableCenter)
  playedCardSelf.value = card
  
  // Simula jogada do oponente (lógica simples)
  if (game.player1Hand.length > 0) {
    const randomIndex = Math.floor(Math.random() * game.player1Hand.length)
    playedCardOpponent.value = game.player1Hand[randomIndex]
  }

  // AQUI: Adicionar lógica para remover a carta da mão no Store
  // game.playCard(index) ...
}
</script>