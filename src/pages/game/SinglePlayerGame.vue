<template>
  <div 
    v-if="game.gameEnded || match.status === 'finished'" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
      
      <div class="p-8 text-center" :class="headerBgClass">
        <div class="mx-auto w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 shadow-inner text-3xl text-white">
          {{ headerIcon }}
        </div>
        <h2 class="text-3xl font-black text-white uppercase tracking-wider drop-shadow-md">
          {{ headerTitle }}
        </h2>
        <p class="text-white/90 font-medium mt-1">
          {{ headerSubtitle }}
        </p>
      </div>

      <div class="p-6 bg-gray-50 border-b border-gray-200">
        <div class="flex justify-between items-center px-4">
            <div class="flex flex-col items-center">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">You</span>
                <span class="text-5xl font-black transition-all" :class="match.scores.player1 > match.scores.player2 ? 'text-green-600 scale-110' : 'text-gray-700'">
                    {{ match.scores.player1 }}
                </span>
            </div>

            <div class="flex flex-col items-center px-4">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">GOAL</span>
                <span class="text-xl font-black text-gray-300">4</span>
            </div>

            <div class="flex flex-col items-center">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Bot</span>
                <span class="text-5xl font-black transition-all" :class="match.scores.player2 > match.scores.player1 ? 'text-red-600 scale-110' : 'text-gray-700'">
                    {{ match.scores.player2 }}
                </span>
            </div>
        </div>
        
        <div class="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
            <div class="h-full bg-green-500 transition-all duration-500" :style="{ width: (match.scores.player1 / 4 * 50) + '%' }"></div>
            <div class="h-full bg-transparent flex-grow"></div>
            <div class="h-full bg-red-500 transition-all duration-500" :style="{ width: (match.scores.player2 / 4 * 50) + '%' }"></div>
        </div>
      </div>

      <div class="px-6 py-3 bg-white flex justify-center gap-4 text-sm text-gray-500 font-medium border-b border-gray-100">
        <span>Last Round:</span>
        <span :class="game.scores.player1 > 60 ? 'text-green-600 font-bold' : ''">You {{ game.scores.player1 }}</span>
        <span>-</span>
        <span :class="game.scores.player2 > 60 ? 'text-red-600 font-bold' : ''">Bot {{ game.scores.player2 }}</span>
      </div>

      <div class="p-6 space-y-3 bg-white">
        
        <button 
           v-if="match.status === 'ongoing'" 
           @click="game.startNewGame()"
           class="w-full py-4 rounded-xl font-black text-white shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 ring-4 ring-blue-100"
        >
           <span>🃏</span> Deal Next Hand
        </button>

        <button 
           v-if="match.status === 'finished'" 
           @click="restartFullMatch"
           class="w-full py-4 rounded-xl font-black text-white shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
           :class="match.scores.player1 >= 4 ? 'bg-green-600 hover:bg-green-700 ring-4 ring-green-100' : 'bg-gray-800 hover:bg-gray-900 ring-4 ring-gray-200'"
        >
           <span>🔄</span> Play Again
        </button>

        <button 
           @click="exitGame"
           class="w-full py-3 rounded-xl font-bold text-gray-500 bg-white hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 transition-all flex items-center justify-center gap-2"
        >
           <span>🚪</span> Exit to Lobby
        </button>

      </div>
    </div>
  </div>
  <div v-else class="flex flex-col justify-between p-3 box-border h-dvh w-full">
    
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
        :last-opponent-card="lastRoundOpponentCard"
        :last-player-card="lastRoundPlayerCard"
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
import { useMatchStore } from '@/stores/match'
import { useRouter } from 'vue-router'
import GameCard from '@/components/game/GameCard.vue'
import GameBoard from '@/components/game/GameBoard.vue'

const game = useGameStore()
const router = useRouter()
const match = useMatchStore()

// Animação visual das cartas jogadas
const playedCardSelf = computed(() => game.tableCards.find(c => c.player === 1))
const playedCardOpponent = computed(() => game.tableCards.find(c => c.player === 2))

// Cartas da última ronda jogadas
const lastRoundPlayerCard = computed(() => game.lastRoundCards.find(c => c.player === 1))
const lastRoundOpponentCard = computed(() => game.lastRoundCards.find(c => c.player === 2))

//Update dos scores
const opponentScore = computed(() => game.scores.player2)
const playerScore = computed(() => game.scores.player1)

onMounted(() => {
  // Inicia a Match
  match.initMatch()
  // Inicialização do jogo
  game.startNewGame()
})

function handlePlayCard(card, index) {
  // 1. O Jogador joga a carta na lógica da Store
  game.playCardLocal(card, 1) // 1 = Jogador Humano
}

// Após Match acabar
const restartFullMatch = () => {
    match.initMatch()
    game.startNewGame()
}

// Lógica de Textos e Cores
const headerTitle = computed(() => {
    // 1. Se a PARTIDA acabou
    if (match.status === 'finished') {
        return match.scores.player1 >= 4 ? 'MATCH VICTORY!' : 'MATCH DEFEAT!'
    }
    // 2. Se for apenas a RONDA
    if (game.scores.player1 > 60) return 'Round Won!'
    if (game.scores.player1 < 60) return 'Round Lost!'
    return 'Round Draw!'
})

const headerSubtitle = computed(() => {
    if (match.status === 'finished') {
        return match.scores.player1 >= 4 
            ? 'Congratulations! You won the match.' 
            : 'You lost this time.'
    }
    // Subtítulo da ronda
    let msg = ''
    if (game.scores.player1 < 61) msg = '' 
    else if (game.scores.player1 < 91 ) msg = 'You did a simple!'
    else if (game.scores.player1 < 120) msg = 'You achieved a capote!'
    else msg = 'You achieved a bandeira!'
    return msg
})

const headerIcon = computed(() => {
    if (match.status === 'finished') {
        return match.scores.player1 >= 4 ? '🏆' : '❌'
    }
    return game.scores.player1 > 60 ? '👍' : '👎'
})

const headerBgClass = computed(() => {
    // Prioridade à Match
    if (match.status === 'finished') {
        return match.scores.player1 >= 4 ? 'bg-green-600' : 'bg-red-700'
    }
    // Cores da Ronda (mais suaves)
    if (game.scores.player1 > 60) return 'bg-blue-500' // Azul para vitória parcial
    if (game.scores.player1 < 60) return 'bg-orange-500' // Laranja para derrota parcial
    return 'bg-gray-500'
})

const exitGame = () => {
  router.push('/dashboard')
}

</script>