<template>
  <button 
    @click="openModal"
    class="group flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm 
           hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 hover:shadow-md 
           transition-all duration-200 ease-in-out text-slate-600 font-medium text-sm"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-1 transition-transform duration-200">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
    <span>Quit Match</span>
  </button>

  <!-- Div de confirmação para sair da partida -->
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title">
      
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity z-0" @click="closeModal"></div>

      <div class="relative bg-white rounded-xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 text-center transform transition-all overflow-hidden">
        
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 mb-4">
          <svg class="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h3 class="text-lg font-bold text-slate-900 mb-2" id="modal-title">
          Forfeit the Match?
        </h3>
        <p class="text-sm text-slate-500 mb-6">
          If you leave now, you will lose all the progress from this match and it will count as a <span class="font-bold text-rose-600">defeat</span>.
        </p>

        <!-- Botões de Ação -->
        <div class="flex flex-col-reverse sm:flex-row gap-3 justify-center">
          <button 
            @click="closeModal"
            class="w-full inline-flex justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
          >
            No
          </button>
          
          <button 
            @click="confirmLeave"
            class="w-full inline-flex justify-center rounded-lg border border-transparent bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  <div 
    v-if="game.gameEnded || match.status === 'finished'" 
    class="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
  >
    <div class="flex flex-col md:flex-row w-full md:w-auto md:max-w-4xl items-stretch relative animate-in fade-in zoom-in duration-300">
      <div class="bg-white rounded-t-2xl md:rounded-l-2xl md:rounded-r-none w-full md:max-w-md overflow-hidden relative z-10 flex flex-col">
         <div class="p-8 text-center" :class="headerBgClass">
            <div class="mx-auto w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 shadow-inner text-3xl text-white">
              <component :is="headerIcon" class="w-8 h-8 text-white" />
            </div>
            <h2 class="text-3xl font-black text-white uppercase tracking-wider drop-shadow-md">{{ headerTitle }}</h2>
            <p class="text-white/90 font-medium mt-1">{{ headerSubtitle }}</p>
         </div>

         <div v-if="auth.currentUser" class="p-6 bg-gray-50 border-b border-gray-200">
            <div class="flex justify-between items-center px-4">
                <div class="flex flex-col items-center">
                    <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">You</span>
                    <span class="text-5xl font-black transition-all" :class="match.marks.player1 > match.marks.player2 ? 'text-green-600 scale-110' : 'text-gray-700'">{{ match.marks.player1 }}</span>
                </div>
                <div class="flex flex-col items-center px-4">
                    <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">GOAL</span>
                    <span class="text-xl font-black text-gray-300">4</span>
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Bot</span>
                    <span class="text-5xl font-black transition-all" :class="match.marks.player2 > match.marks.player1 ? 'text-red-600 scale-110' : 'text-gray-700'">{{ match.marks.player2 }}</span>
                </div>
            </div>
            <div class="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
                <div class="h-full bg-green-500 transition-all duration-500" :style="{ width: (match.marks.player1 / 4) * 50 + '%' }"></div>
                <div class="h-full bg-transparent flex-grow"></div>
                <div class="h-full bg-red-500 transition-all duration-500" :style="{ width: (match.marks.player2 / 4) * 50 + '%' }"></div>
            </div>
         </div>

        <div
          class="px-6 py-3 bg-white flex justify-center gap-4 text-sm text-gray-500 font-medium border-b border-gray-100">
          <span>Last Round:</span>
          <span :class="game.scores.player1 > 60 ? 'text-green-600 font-bold' : ''">You {{ game.scores.player1 }}</span>
          <span>-</span>
          <span :class="game.scores.player2 > 60 ? 'text-red-600 font-bold' : ''">Bot {{ game.scores.player2 }}</span>
        </div>

         <div v-if="!auth.anonymous" class="mt-6 px-6"> <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Match History</h3>
            <div class="space-y-3 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                <div v-for="game in match.gamesHistory" :key="game.roundNumber" class="bg-gray-50 border border-gray-100 rounded-lg p-3 relative overflow-hidden shadow-sm">
                    <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="game.winner ? (game.winner === currentUserId ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-500'"></div>
                    <div class="pl-3">
                        <div class="flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
                            <span class="font-bold text-gray-700 text-sm">Game {{ game.roundNumber }}</span>
                            <div class="flex items-center gap-2">
                                <span v-if="game.scoreDetail.player1 >= 61" class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">{{ game.scoreDetail.player1 < 61 ? '' : (game.scoreDetail.player1 < 91 ? 'Risca' : (game.scoreDetail.player1 < 120 ? 'Capote' : 'Bandeira')) }}</span>
                                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">{{ game.marksAwarded.player1 }} pts</span>
                                <span class="text-xs font-black uppercase" :class="game.winner ? (game.winner === currentUserId ? 'text-green-600' : 'text-red-600') : 'text-gray-600'">{{ game.winner ? (game.winner === currentUserId ? "WIN" : "LOSE") : "DRAW" }}</span>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 items-center text-center">
                            <div class="flex flex-col"><span class="text-[10px] uppercase font-bold text-gray-400">Me</span><span class="text-xl font-black leading-none" :class="game.scoreDetail.player1 > game.scoreDetail.player2 ? 'text-gray-800' : 'text-gray-400'">{{ game.scoreDetail.player1 }}</span></div>
                            <div class="text-gray-300 font-bold text-xs italic">vs</div>
                            <div class="flex flex-col"><span class="text-[10px] uppercase font-bold text-gray-400">Bot</span><span class="text-xl font-black leading-none" :class="game.scoreDetail.player2 > game.scoreDetail.player1 ? 'text-gray-800' : 'text-gray-400'">{{ game.scoreDetail.player2 }}</span></div>
                        </div>
                    </div>
                </div>
            </div>
         </div>

         <div class="p-6 space-y-3 bg-white">
            <button v-if="match.status === 'ongoing' || !auth.currentUser" @click="game.startNewGame()" class="w-full py-4 rounded-xl font-black text-white shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 ring-4 ring-blue-100">
              <Hand class="w-5 h-5" /> {{auth.currentUser ? 'Deal Next Hand' : 'Play again'}}
            </button>
            <button v-if="match.status === 'finished'" @click="restartFullMatch" class="w-full py-4 rounded-xl font-black text-white shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2" :class="match.marks.player1 >= 4 ? 'bg-green-600 hover:bg-green-700 ring-4 ring-green-100' : 'bg-gray-800 hover:bg-gray-900 ring-4 ring-gray-200'">
              <RotateCcw class="w-5 h-5" /> Play Again
            </button>
            <button @click="exitGame" class="w-full py-3 rounded-xl font-bold text-gray-500 bg-white hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 transition-all flex items-center justify-center gap-2">
              <DoorOpen class="w-5 h-5" /> Exit to Lobby
            </button>
         </div>
      </div>

      <div v-if="!auth.anonymous && match.isRanked"
        class="flex flex-col w-full md:w-72 bg-amber-50 rounded-b-2xl md:rounded-r-2xl md:rounded-l-none md:mt-0 border
        border-t md:border-t-0 md:border-l border-amber-100 p-6 transform transition-all duration-500 delay-100 origin-top
         md:origin-left" :class="match.status === 'finished' ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
        <h3
          class="text-sm font-black text-amber-800 uppercase tracking-wider mb-6 flex items-center justify-center md:justify-start gap-2">
          <Gift class="w-5 h-5" /> Rewards
        </h3>

        <div class="bg-white rounded-xl p-4 border border-amber-200 shadow-sm mb-6 text-center">
          <span class="block text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Total Earned</span>
          <div class="flex items-center justify-center gap-2 text-amber-600">
            <Coins class="w-8 h-8" />
            <span class="text-4xl font-black">{{ calculateTotalCoins  }}</span>
          </div>
        </div>

        <div class="flex-grow">
          <h4 class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 text-center md:text-left">
            Achievements</h4>

          <div v-if="earnedAchievements.length === 0" class="text-center py-8 opacity-50 text-amber-800 text-sm italic">
            No special achievements this match.
          </div>

          <div class="space-y-3">
            <div v-for="(ach, index) in earnedAchievements" :key="index"
              class="flex items-center gap-3 bg-white p-3 rounded-lg border border-amber-100 shadow-sm animate-in slide-in-from-left duration-500"
              :style="{ animationDelay: `${index * 150}ms` }">
              <div
                class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xl bg-amber-100 border border-amber-200">
                <component :is="ach.icon" class="w-6 h-6 text-amber-700" />
              </div>
              <div class="min-w-0">
                <p class="font-bold text-amber-900 text-sm leading-tight truncate">{{ ach.title }}</p>
                <p class="text-[10px] text-amber-600 font-medium truncate">{{ ach.desc }}</p>
              </div>
              <div class="ml-auto flex-shrink-0">
                <span
                  class="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">+{{
                    ach.bonus }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col justify-between p-3 box-border h-dvh w-full" ref="gameDiv">
    <section class="flex flex-wrap md:gap-2 justify-center p-2 -space-x-6 md:space-x-2 overflow-visible">
      <GameCard v-for="(card, i) in game.player2Hand" :key="'top-' + i" :card="card" :face-down="true" />
    </section>

    <section class="flex-grow flex items-center justify-center">
      <GameBoard :trunfo="game.trunfo" :deck-count="game.deck.length" :player-played-card="playedCardSelf"
        :opponent-played-card="playedCardOpponent" :opponent-score="opponentScore" :player-score="playerScore"
        :last-opponent-card="lastRoundOpponentCard" :last-player-card="lastRoundPlayerCard" :currentTurn="currentTurn"
        :player="auth.currentUser" :opponent="opponent" @undo="handleUndo" />
    </section>

    <section class="flex flex-wrap gap-2 justify-center p-4 md:pb-8 pb-24">
      <GameCard
        v-for="(card, i) in game.player1Hand"
        :key="'bottom-' + i"
        :card="card"
        :is-interactive="game.currentTurn === currentUserId && game.tableCards.length < 2"
        @card-click="handlePlayCard(card, i)"
        class="transition-transform duration-200"
        :class="{ 'hover:-translate-y-4': game.currentTurn === currentUserId && game.tableCards.length < 2 }"
      />
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useGameStore } from "@/stores/game.js";
import { useMatchStore } from "@/stores/match";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import GameCard from "@/components/game/GameCard.vue";
import GameBoard from "@/components/game/GameBoard.vue";
import {
  Trophy, X, ThumbsUp, Handshake, ThumbsDown, RotateCcw, DoorOpen, Gift, Coins,
  Flag, Badge, Sparkles, Hand
} from 'lucide-vue-next'

const gameDiv = ref(null);

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
const router = useRouter();
const match = useMatchStore();
const auth = useAuthStore();

const currentUserId = auth.currentUser?.id ?? -1
const opponent = computed (() => (match.opponent))

const currentTurn = computed(() => (game.currentTurn))

const isOpen = ref('')

const handleUndo = () => {
  game.undoAction()
}

// Animação visual das cartas jogadas
const playedCardSelf = computed(() =>
  game.tableCards.find((c) => c.player === currentUserId)
);
const playedCardOpponent = computed(() =>
  game.tableCards.find((c) => c.player === auth.BOT_ID)
);

// Cartas da última ronda jogadas
const lastRoundPlayerCard = computed(() =>
  game.lastRoundCards.find((c) => c.player === currentUserId)
);
const lastRoundOpponentCard = computed(() =>
  game.lastRoundCards.find((c) => c.player === auth.BOT_ID)
);

//Update dos scores
const opponentScore = computed(() => game.scores.player2);
const playerScore = computed(() => game.scores.player1);

onMounted(() => {
  // Inicia a Match
   if (!auth.anonymous) match.initMatch();
  // Inicialização do jogo
  game.startNewGame();
});

function handlePlayCard(card, index) {
  // 1. O Jogador joga a carta na lógica da Store
  game.playCardLocal(card, currentUserId);
}

// Após Match acabar
const restartFullMatch = () => {
  match.initMatch();
  game.startNewGame();
};

// Lógica de Textos e Cores
const headerTitle = computed(() => {
  // 1. Se a PARTIDA acabou
  if (match.status === "finished") {
    return match.marks.player1 >= 4 ? "VICTORY!" : "DEFEAT!";
  }
  // 2. Se for apenas a RONDA
  if (game.scores.player1 > 60) return "Round Won!";
  if (game.scores.player1 < 60) return "Round Lost!";
  return "Round Draw!";
});

const headerSubtitle = computed(() => {
  if (match.status === "finished") {
    return match.marks.player1 >= 4
      ? "Congratulations! You won the match."
      : "You lost this time.";
  }
  // Subtítulo da ronda
  let msg = "";
  if (game.scores.player1 < 61) msg = "";
  else if (game.scores.player1 < 91) msg = "You did a simple!";
  else if (game.scores.player1 < 120) msg = "You achieved a capote!";
  else msg = "You achieved a bandeira!";
  return msg;
});

const headerIcon = computed(() => {
  if (match.status === "finished") {
    return match.marks.player1 >= 4 ? Trophy : X
  }
  return game.scores.player1 > 60
    ? ThumbsUp
    : game.scores.player1 === 60
      ? Handshake
      : ThumbsDown
});

const headerBgClass = computed(() => {
  // Prioridade à Match
  if (match.status === "finished") {
    return match.marks.player1 >= 4 ? "bg-green-600" : "bg-red-700";
  }
  // Cores da Ronda (mais suaves)
  if (game.scores.player1 > 60) return "bg-blue-500"; // Azul para vitória parcial
  if (game.scores.player1 < 60) return "bg-orange-500"; // Laranja para derrota parcial
  return "bg-gray-500";
});

const exitGame = () => {
  router.push("/dashboard");
};

// Lógica de Achievements e Moedas
const earnedAchievements = computed(() => {
  const list = []
  match.gamesHistory.forEach(game => {
    if (game.winner == auth.currentUser.id) {
      if (game.scoreDetail.player1 >= 120) {
        list.push({ icon: Flag, title: 'Bandeira', desc: 'Won all tricks', bonus: 6 })
      } else if (game.scoreDetail.player1 >= 91) {
        list.push({ icon: Badge, title: 'Capote', desc: 'Opponent scored 0', bonus: 4 })
        console.log("Capote achieved")
      } else if (game.scoreDetail.player1 > 60) {
        list.push({ icon: Sparkles, title: 'Victory', desc: 'Simple win', bonus: 3 })
        console.log("Victory achieved")
      }

    }
  })
  if (match.status === 'finished' && match.marks.player1 >= 4) {
    list.unshift({ icon: Trophy, title: 'Match Winner', desc: 'Defeated the Opponent', bonus: 0 })
  }
  return list
})

const calculateTotalCoins = computed(() => {
  console.log("Somand")
  return earnedAchievements.value.reduce((total, item) => total + item.bonus, 0)
})

/////////// Sistema de Quit da partida //////////////
const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const confirmLeave = () => {
  // Eventualmente adicionar lógica extra...
  // matchStore.forfeitMatch()... por exemplo
  
  isOpen.value = false
  router.push({ name: 'dashboard' })
}
</script>
