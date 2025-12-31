<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
    <div class="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

      <!-- ===================== -->
      <!-- MINHA PROPOSTA -->
      <!-- ===================== -->
      <div class="p-8 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
          A Tua Sugestão
        </span>

        <div class="text-5xl font-black text-emerald-600 mb-6 flex items-center gap-2">
          {{ localStake }}
          <Coins class="w-8 h-8 text-yellow-500" />
        </div>

        <input
          type="range"
          min="3"
          max="100"
          step="1"
          v-model.number="localStake"
          :disabled="myAccepted"
          class="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500 mb-8"
        />

        <button
          @click="proposeStake"
          :disabled="myAccepted"
          class="w-full py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95
                 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400"
        >
          Sugerir {{ localStake }}
        </button>
      </div>

      <!-- ===================== -->
      <!-- PROPOSTA DO OPONENTE -->
      <!-- ===================== -->
      <div class="p-8 bg-slate-50/50 flex flex-col items-center justify-center">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
          Sugestão do Adversário
        </span>

        <div
          class="text-5xl font-black text-slate-700 mb-4 flex items-center gap-2"
          :class="{ 'opacity-40': opponentStake == null }"
        >
          {{ opponentStake ?? '—' }}
          <Coins class="w-8 h-8 text-yellow-500" />
        </div>

        <div class="mt-4 flex flex-col items-center gap-3 w-full">
          <div
            class="p-4 rounded-full text-white shadow-xl transition-all duration-300"
            :class="opponentAccepted
              ? 'bg-emerald-500 shadow-emerald-200'
              : 'bg-amber-400 shadow-amber-100'"
          >
            <CheckCircle2 v-if="opponentAccepted" class="w-10 h-10" />
            <Clock v-else class="w-10 h-10 animate-pulse" />
          </div>

          <span
            class="text-[10px] font-bold uppercase tracking-widest"
            :class="opponentAccepted ? 'text-emerald-600' : 'text-amber-600'"
          >
            {{ opponentAccepted ? 'Ele Aceitou' : 'Ele está a decidir' }}
          </span>

          <button
            v-if="opponentStake !== null && !myAccepted"
            @click="acceptStake"
            class="mt-4 px-6 py-3 rounded-full font-bold text-white flex items-center gap-2
                   bg-emerald-600 hover:bg-emerald-700 shadow-lg active:scale-95"
          >
            <CheckCircle2 class="w-5 h-5" />
            Aceitar {{ opponentStake }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Coins, CheckCircle2, Clock } from 'lucide-vue-next'

/* =====================
   PROPS & EMITS
===================== */
const props = defineProps({
  matchInfo: { type: Object, required: true },
  currentUserId: { type: [String, Number], required: true }
})

const emit = defineEmits(['propose-stake', 'accept-stake'])

/* =====================
   STATE LOCAL
===================== */
const localStake = ref(3)

/* =====================
   IDENTIDADE
===================== */
const amIPlayer1 = computed(() => props.matchInfo.player1_id === props.currentUserId)

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
  emit('propose-stake', localStake.value)
}

const acceptStake = () => {
  emit('accept-stake')
}
</script>
