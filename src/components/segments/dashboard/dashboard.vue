<template>
  <section class="snap-start snap-always w-full shrink-0 px-4 mt-6 lg:mt-12">
    <div class="grid place-items-center gap-8 lg:grid-cols-2">
      <div class="flex flex-col items-center lg:items-start text-center lg:text-left select-none">
        <img src="@/assets/logo.png" alt="Bisca Royal logo" />
      </div>

      <div class="flex flex-col items-center gap-5 w-full">
        <button @click="openConfig(true)"
          class="cursor-pointer w-64 sm:w-72 lg:w-80 rounded-xl border-b-4 border-black bg-emerald-500 px-6 py-4 text-xl lg:text-2xl font-black text-white shadow-lg hover:bg-emerald-400 active:border-b-0 active:translate-y-1 transition-all">
          PLAY MULTIPLAYER
        </button>
        
        <button @click="openConfig(false)"
          class="cursor-pointer w-64 sm:w-72 lg:w-80 rounded-xl border-b-4 border-black bg-gray-200 px-6 py-4 text-xl lg:text-2xl font-black text-black shadow-lg hover:bg-white active:border-b-0 active:translate-y-1 transition-all">
          SINGLEPLAYER
        </button>
      </div>
    </div>

    <div v-if="showModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
      
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all">
        <div class="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 class="text-xl font-black text-slate-900">Game Setup</h3>
            <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">
              {{ pendingIsRanked ? 'Multiplayer Ranked' : 'Singleplayer Practice' }}
            </p>
          </div>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
            <label class="text-sm font-bold text-slate-700 block mb-3">Select Format</label>
            <div class="grid grid-cols-2 gap-3">
              <button @click="pendingIsMatch = true" 
                :class="pendingIsMatch ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-600/20' : 'border-slate-200 text-slate-500 hover:border-slate-300'"
                class="flex flex-col items-center p-3 rounded-xl border-2 transition-all">
                <span class="font-bold">Match</span>
              </button>
              <button @click="pendingIsMatch = false" 
                :class="!pendingIsMatch ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-600/20' : 'border-slate-200 text-slate-500 hover:border-slate-300'"
                class="flex flex-col items-center p-3 rounded-xl border-2 transition-all">
                <span class="font-bold">Game</span>
              </button>
            </div>

            <!-- Warning Box -->
            <div v-if="pendingIsRanked && !pendingIsMatch" class="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-3 items-start">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                class="w-5 h-5 text-amber-600 shrink-0 mt-0.5">
                <path fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clip-rule="evenodd" />
              </svg>
              <p class="text-xs text-amber-800 leading-relaxed">
                Upon confirmation, <span class="font-bold">2 coins</span> will be immediately deducted from your account
                balance.
              </p>
            </div>

          <div>
            <label class="text-sm font-bold text-slate-700 block mb-3">Cards in Hand</label>
            <div class="grid grid-cols-2 gap-3">
              <button @click="selectedType = 3" 
                :class="selectedType === 3 ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-300'"
                class="p-3 rounded-xl border-2 font-bold transition-all">
                Bisca do 3 
              </button>
              <button @click="selectedType = 9" 
                :class="selectedType === 9 ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-300'"
                class="p-3 rounded-xl border-2 font-bold transition-all">
                Bisca do 9
              </button>
            </div>
          </div>

          <div v-if="pendingIsRanked && !pendingIsMatch" class="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Coins class="size-5 text-amber-600"/>
                <span class="text-sm font-bold text-amber-900">Entry Fee</span>
              </div>
              <span class="text-lg font-black text-amber-900">{{ gameCost }} Coins</span>
            </div>
            <p v-if="errorMessage" class="text-xs text-rose-600 mt-2 font-semibold text-center">{{ errorMessage }}</p>
          </div>

          <button @click="confirmStart"
            class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-lg shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]">
            CONFIRM & START
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { Coins } from "lucide-vue-next";
import { useMatchStore } from "@/stores/match";
import { useGameStore } from "@/stores/game.js";
import { useAPIStore } from "@/stores/api.js";

const authStore = useAuthStore();
const router = useRouter();
const matchStore = useMatchStore();
const gameStore = useGameStore();
const apiStore = useAPIStore();

// Modal States
const showModal = ref(false);
const errorMessage = ref("");

// Selected Options
const pendingIsRanked = ref(false);
const pendingIsMatch = ref(true);
const selectedType = ref(3);
const gameCost = 2;

const ID_GAME_FEE = 5
const COINS_GAME_FEE = -2

function openConfig(isRanked: boolean) {
  pendingIsRanked.value = isRanked;
  errorMessage.value = "";
  showModal.value = true;
}

async function confirmStart() {
  // Sync Stores
  matchStore.isRanked = pendingIsRanked.value;
  matchStore.type = selectedType.value;
  gameStore.type = selectedType.value;

  try {
    // 1. Ranked Validation
    if (pendingIsRanked.value) {
      if (!authStore.currentUser || authStore.currentUser.coins_balance < gameCost) {
        errorMessage.value = "Insufficient coins balance.";
        return;
      }
      
      if (pendingIsMatch.value) {
        router.push("/games/multiplayer");
      } else {
        // TODO: Start Multiplayer Single Game logic
        console.log("TODO: Start Multiplayer Single Game");
      }
      return;
    }
    
    // 2. Singleplayer Logic
    if (pendingIsMatch.value) {
      authStore.currentUser = await ((await apiStore.updateCoinsUser(COINS_GAME_FEE)).data)
      router.push("/games/singleplayer");
    } else {
      // TODO: Start Singleplayer Single Game logic
      router.push("/games/singleplayer");
      console.log("TODO: Start Singleplayer Single Game");
    }
    
    showModal.value = false;

  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || "Failed to start game";
  }
}
</script>