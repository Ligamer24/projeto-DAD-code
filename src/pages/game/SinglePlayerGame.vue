<template>
  <div class="flex flex-col justify-between p-3 box-border h-dvh w-full">
    
    <section class="flex flex-wrap gap-2 justify-center p-2">
      <GameCard 
        v-for="(card, i) in game.player2Hand" 
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
        :opponent-score="opponentScore"
        :player-score="playerScore"
      />
    </section>

    <section class="flex flex-wrap gap-[-2rem] justify-center p-4 pb-8">
      <GameCard 
        v-for="(card, i) in game.player1Hand" 
        :key="'bottom-' + i"
        :card="card"
        :is-interactive="game.currentTurn === 1 && game.tableCards.length < 2"
        @card-click="handlePlayCard(card, i)"
        class="hover:-translate-y-4 transition-transform duration-200"
      />
      </section>

  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useGameStore } from "@/stores/game.js"
import GameCard from '@/components/game/GameCard.vue'
import GameBoard from '@/components/game/GameBoard.vue'

const game = useGameStore()

// Animação visual das cartas jogadas
const playedCardSelf = computed(() => game.tableCards.find(c => c.player === 1))
const playedCardOpponent = computed(() => game.tableCards.find(c => c.player === 2))

//Update dos scores
const opponentScore = computed(() => game.scores.player2)
const playerScore = computed(() => game.scores.player1)

onMounted(() => {
  // Inicialização do jogo
  game.initSinglePlayerGame()
})

function handlePlayCard(card, index) {
  // 1. O Jogador joga a carta na lógica da Store
  game.playCardLocal(card, 1) // 1 = Jogador Humano
}
</script>