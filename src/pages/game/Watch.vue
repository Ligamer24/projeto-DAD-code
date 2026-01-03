<template>
  <button
      @click="exitMatch"
      class="group flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm
           hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 hover:shadow-md cursor-pointer
           transition-all duration-200 ease-in-out text-slate-600 font-medium text-sm"
  >
    <DoorOpen class="w-4 h-4" />
    <span>Leave Spectating</span>
  </button>

  <div
      v-if="game.multiplayerGame.gameEnded || match.status === 'finished'"
      class="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
  >
    <div
        v-if="(game.multiplayerGame.gameEnded || match.status === 'finished') && earnedAchievements.length > 0"
        class="absolute inset-0 z-0 pointer-events-none opacity-50"
        :style="{ backgroundImage: `url(${fireworksGif})`, backgroundSize: 'contain' }"
    ></div>
    <div
        class="flex flex-col md:flex-row w-full md:w-auto md:max-w-4xl items-stretch relative animate-in fade-in zoom-in duration-300">
      <div
          class="bg-white rounded-t-2xl md:rounded-l-2xl md:rounded-r-none w-full md:max-w-md overflow-hidden relative z-10 flex flex-col">
        <div class="p-8 text-center" :class="headerBgClass">
          <div
              class="mx-auto w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 shadow-inner text-3xl text-white">
            <component :is="headerIcon" class="w-8 h-8 text-white"/>
          </div>
          <h2 class="text-3xl font-black text-white uppercase tracking-wider drop-shadow-md">{{ headerTitle }}</h2>
          <p class="text-white/90 font-medium mt-1">{{ headerSubtitle }}</p>
        </div>

        <div class="p-6 bg-gray-50 border-b border-gray-200">
          <div class="flex justify-between items-center px-4">
            <div class="flex flex-col items-center">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Player 1</span>
              <span class="text-5xl font-black transition-all"
                    :class="match.marks.player1 > match.marks.player2 ? 'text-green-600 scale-110' : 'text-gray-700'">{{
                  game.context === "mp-match" ? match.marks.player1 : game.gameMarks.player1
                }}</span>
            </div>
            <div class="flex flex-col items-center px-4">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">GOAL</span>
              <span class="text-xl font-black text-gray-300">4</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Player 2</span>
              <span class="text-5xl font-black transition-all"
                    :class="match.marks.player2 > match.marks.player1 ? 'text-red-600 scale-110' : 'text-gray-700'">{{
                  game.context === "mp-match" ? match.marks.player2 : game.gameMarks.player2
                }}</span>
            </div>
          </div>
          <div class="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
            <div class="h-full bg-green-500 transition-all duration-500"
                 :style="{ width: (match.marks.player1 / 4) * 50 + '%' }"></div>
            <div class="h-full bg-transparent grow"></div>
            <div class="h-full bg-red-500 transition-all duration-500"
                 :style="{ width: (match.marks.player2 / 4) * 50 + '%' }"></div>
          </div>
        </div>

        <div
            class="px-6 py-3 bg-white flex justify-center gap-4 text-sm text-gray-500 font-medium border-b border-gray-100">
          <span>Last Round:</span>
          <span :class="p1Score > 60 ? 'text-green-600 font-bold' : ''">P1 {{ p1Score }}</span>
          <span>-</span>
          <span :class="p2Score > 60 ? 'text-red-600 font-bold' : ''">P2 {{ p2Score }}</span>
        </div>

        <div class="p-6 space-y-3 bg-white">
          <button @click="exitMatch"
                  class="w-full py-3 rounded-xl font-bold text-gray-500 bg-white hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 transition-all flex items-center justify-center gap-2">
            <DoorOpen class="w-5 h-5"/>
            Exit to Lobby
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="flex flex-col justify-between p-3 box-border h-dvh w-full" ref="gameDiv">
    <section class="flex flex-row items-center relative z-30">
      
      <div class="relative flex flex-col gap-2 mr-4">
        <button
            @click="shareLink"
            class="group flex items-center justify-center w-10 h-10 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl
                   hover:bg-blue-500 hover:border-blue-400 text-white shadow-lg transition-all duration-200"
            title="Share Match Link"
        >
          <Share2 class="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        <div v-if="shared" class="absolute top-0 left-14 bg-slate-900 text-white text-xs font-bold rounded-lg px-3 py-2 shadow-xl animate-in fade-in slide-in-from-left-2 whitespace-nowrap z-50">
          Link copied!
        </div>
      </div>

      <div class="w-full flex flex-wrap md:gap-2 justify-center p-2 -space-x-6 md:space-x-2 overflow-visible">
        <GameCard v-for="(card, i) in p2Hand" :key="'top-' + i" :card="card" :face-down="false"/>
      </div>
    </section>

    <section class="grow flex items-center justify-center relative">

      <div 
        v-if="game.currentTurn"
        class="absolute z-50 right-4 md:right-10 top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div class="pointer-events-auto">
          <GameTimer 
            :key="`${game.currentTurn}-${p1Score}-${p2Score}`"
            :duration="20"
          />
        </div>
      </div>
      <GameBoard 
      :trunfo="game.trunfo" 
      :deck-count="game.deck.length"
      :currentTurn="game.currentTurn"
      
      :player-played-card="playedCardSelf"
      :opponent-played-card="playedCardOpponent"
      
      :opponent-score="p2Score"
      :player-score="p1Score"

      :last-player-card="lastRoundPlayerCard"
      :last-opponent-card="lastRoundOpponentCard"
      
      :player="game.multiplayerGame.player1Data ?? {name: 'Player 1', id: game.multiplayerGame.player1}"
      :opponent="game.multiplayerGame.player2Data ?? {name: 'Player 2', id: game.multiplayerGame.player2}"

      :player-marks="game.context === 'mp-match' ? match.marks.player1 : game.gameMarks.player1"
      :opponent-marks="game.context === 'mp-match' ? match.marks.player2 : game.gameMarks.player2"

      :is-ranked="match.isRanked"
      :showEmote="game.showEmote"

      :allowUndo="false"
      />
    </section>

    <section class="w-full flex flex-wrap md:gap-2 justify-center p-2 -space-x-6 md:space-x-2 overflow-visible">
      <GameCard
          v-for="(card, i) in p1Hand"
          :key="'bottom-' + i"
          :card="card"
          :is-interactive="false"
          class="transition-transform duration-200"
      />
    </section>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useGameStore} from "@/stores/game.js";
import {useMatchStore} from "@/stores/match";
import {useAuthStore} from "@/stores/auth";
import {useRouter, useRoute} from "vue-router";
import GameCard from "@/components/game/GameCard.vue";
import GameBoard from "@/components/game/GameBoard.vue";
import GameTimer from "@/components/game/GameTimer.vue";
import {
  DoorOpen,
  Handshake,
  Trophy,
  Share2
} from 'lucide-vue-next'
import fireworksGif from '@/assets/fireworks.gif'
import { useSocketStore } from "@/stores/socket";

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
const route = useRoute();
const match = useMatchStore();
const socketStore = useSocketStore()

const matchId = route.params.id

onMounted(() => {
  socketStore.emitWatchMatch(matchId)
});

const playedCardSelf = computed(() => 
    game.tableCards.find((c) => c.playedBy == game.multiplayerGame.player1)
)

const playedCardOpponent = computed(() =>
    game.tableCards.find((c) => c.playedBy == game.multiplayerGame.player2)
)

const lastRoundPlayerCard = computed(() => 
    game.lastRoundCards.find((c) => c.playedBy == game.multiplayerGame.player1)
)
const lastRoundOpponentCard = computed(() => 
    game.lastRoundCards.find((c) => c.playedBy == game.multiplayerGame.player2)
)

const p1Hand = computed(() => game.multiplayerGame.player1Hand || [])
const p2Hand = computed(() => game.multiplayerGame.player2Hand || [])
const p1Score = computed(() => game.multiplayerGame.scores?.player1 || 0)
const p2Score = computed(() => game.multiplayerGame.scores?.player2 || 0)

// Lógica de Textos e Cores
const headerTitle = computed(() => {
  if (match.status === "finished") {
    return match.marks.player1 >= 4 ? "PLAYER 1 WINS!" : "PLAYER 2 WINS!";
  }
  if (game.gameEnded) {
    return "Round Ended";
  }
  return "Match in Progress";
});

const headerSubtitle = computed(() => {
  if (match.status === "finished") {
    return "Match Finished";
  }
  return "";
});

const headerIcon = computed(() => {
  if (match.status === "finished") {
    return Trophy
  }
  return Handshake
});

const headerBgClass = computed(() => {
  if (match.status === "finished") {
    return "bg-slate-800";
  }
  return "bg-slate-800";
});

const exitMatch = () => {
  match.resetState()
  game.resetState()
  router.push("/home");
};

const earnedAchievements = computed(() => []) // Spectators don't earn achievements

/////////// Share things //////////////

const shared = ref(false)
const shareLink = () => {
  const shareURL = `${window.location.origin}/watch/${matchId}`
  navigator.clipboard.writeText(shareURL)
  shared.value = true
  setTimeout(() => {
    shared.value = false
  }, 2000);
}

</script>
