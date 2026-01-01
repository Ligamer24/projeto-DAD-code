<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md transition-all">
    <div class="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 transform transition-all">
      
      <div class="bg-slate-50 px-8 py-6 border-b border-slate-100 flex flex-col items-center text-center">
        <h3 class="text-xl font-black text-slate-900">Negotiate Stake</h3>
        <p class="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Both players must agree on the entry fee</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2">
        <div class="p-8 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
            Your Suggestion
          </span>

          <div class="flex items-center gap-3 mb-6">
            <span class="text-6xl font-black text-emerald-600 leading-none">{{ localStake }}</span>
            <Coins class="w-10 h-10 text-yellow-500" />
          </div>

          <div class="w-full px-2 mb-8">
            <input
              type="range"
              min="3"
              max="100"
              step="1"
              v-model.number="localStake"
              :disabled="myAccepted"
              class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed"
            />
            <div class="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">
              <span>Min: 3</span>
              <span>Max: 100</span>
            </div>
          </div>

          <button
            @click="proposeStake"
            :disabled="myAccepted"
            class="w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95
                   bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
          >
            {{ myAccepted ? 'Suggestion Sent' : `Suggest ${localStake} Coins` }}
          </button>
        </div>

        <div class="p-8 bg-slate-50/50 flex flex-col items-center justify-center">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
            Opponent's Suggestion
          </span>

          <div
            class="flex items-center gap-3 mb-6 transition-all duration-500"
            :class="{ 'opacity-20 scale-90': opponentStake == null }"
          >
            <span class="text-6xl font-black text-slate-700 leading-none">{{ opponentStake ?? '—' }}</span>
            <Coins class="w-10 h-10 text-yellow-500" />
          </div>

          <div class="mt-4 flex flex-col items-center gap-4 w-full text-center">
            <div
              class="relative p-4 rounded-2xl shadow-xl transition-all duration-500"
              :class="opponentAccepted
                ? 'bg-emerald-500 shadow-emerald-200 rotate-0'
                : 'bg-amber-400 shadow-amber-100 -rotate-3'"
            >
              <CheckCircle2 v-if="opponentAccepted" class="w-12 h-12 text-white" />
              <Clock v-else class="w-12 h-12 text-white animate-pulse" />
            </div>

            <div class="space-y-1">
               <span
                class="block text-xs font-black uppercase tracking-widest"
                :class="opponentAccepted ? 'text-emerald-600' : 'text-amber-600'"
              >
                {{ opponentAccepted ? 'Accepted' : 'Deciding...' }}
              </span>
              <p class="text-[10px] text-slate-400 font-bold max-w-[120px]">
                {{ opponentAccepted ? 'The match is ready to start' : 'Waiting for opponent response' }}
              </p>
            </div>

            <button
              v-if="opponentStake !== null && !myAccepted"
              @click="acceptStake"
              class="mt-4 w-full py-3 px-6 rounded-xl font-black text-white flex items-center justify-center gap-2
                     bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-95 transition-all animate-bounce"
            >
              <CheckCircle2 class="w-5 h-5" />
              ACCEPT {{ opponentStake }}
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="myAccepted" class="bg-emerald-600 py-3 text-center">
        <span class="text-white text-[10px] font-black uppercase tracking-[0.2em]">
          Waiting for synchronization...
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Coins, CheckCircle2, Clock } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

/* =====================
   PROPS & EMITS
===================== */
const props = defineProps({
  matchInfo: { type: Object, required: true },
  currentUser: { type: Object, required: true }
})

const emit = defineEmits(['propose-stake', 'accept-stake'])

/* =====================
   STATE LOCAL
===================== */
const localStake = ref(3)

/* =====================
   IDENTIDADE
===================== */
const amIPlayer1 = computed(() => props.matchInfo.player1_id === props.currentUser.id)

const myStake = computed(() =>
  amIPlayer1.value ? props.matchInfo.player1Stake : props.matchInfo.player2Stake
)

const myAccepted = computed(() =>
  amIPlayer1.value ? props.matchInfo.player1Accepted : props.matchInfo.player2Accepted
)

const opponentStake = computed(() =>
  amIPlayer1.value ? props.matchInfo.player2Stake : props.matchInfo.player1Stake
)

const opponentAccepted = computed(() =>
  amIPlayer1.value ? props.matchInfo.player2Accepted : props.matchInfo.player1Accepted
)

/* =====================
   SYNC LOCAL
===================== */
watch(
  myStake,
  (val) => {
    if (val != null && !myAccepted.value) {
      localStake.value = val
    }
  },
  { immediate: true }
)

/* =====================
   ACTIONS
===================== */
const proposeStake = () => {
  if (props.currentUser.coins_balance < localStake.value)
  {
    toast.message("You don't have enough coins!")
    return
  }
  emit('propose-stake', localStake.value)
}

const acceptStake = () => {
  if (props.currentUser.coins_balance < opponentStake.value)
  {
    toast.message("You don't have enough coins!")
    return
  }

  emit('accept-stake')
}
</script>
