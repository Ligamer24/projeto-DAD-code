<template>
  <section class="snap-start snap-always w-full shrink-0 px-4 mt-6 lg:mt-12">
    <div class="grid place-items-center gap-8 lg:grid-cols-2">
      <div class="flex flex-col items-center lg:items-start text-center lg:text-left select-none">
        <img src="@/assets/logo.png" alt="Bisca Royal logo" />
      </div>
      <div class="flex flex-col items-center gap-5 w-full">
        <button v-if="authStore.currentUser" @click="startGame(true)"
          class="cursor-pointer w-64 sm:w-72 lg:w-80 rounded-md border-2 border-black bg-gradient-to-b 
                 from-gray-200 to-gray-400 px-6 py-3 lg:py-4 text-xl lg:text-2xl font-extrabold text-black 
                 shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgba(0,0,0,0.6)]">
          Ranked Match
        </button>
        <button @click="startGame(false)"
          class="cursor-pointer w-64 sm:w-72 lg:w-80 rounded-md border-2 border-black bg-gradient-to-b 
                 from-gray-200 to-gray-400 px-6 py-3 lg:py-4 text-xl lg:text-2xl font-extrabold text-black 
                 shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgba(0,0,0,0.6)]">
          Practice Match
        </button>
      </div>
      <div v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">

        <!-- Modal Container -->
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 transform transition-all">

          <!-- Header / Entry Fee -->
          <div class="bg-slate-50 p-6 text-center border-b border-slate-100">
            <h3 class="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-2">Entry Fee</h3>
            <div class="flex items-center justify-center gap-2 text-slate-900">
              <span class="text-4xl font-black">3</span>
              <Coins class="size-5 lg:size-6 text-yellow-600"/>
            </div>
          </div>

          <div class="p-6 space-y-6">

            <!-- Rewards Section -->
            <div>
              <h4 class="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  class="w-4 h-4 text-emerald-500">
                  <path fill-rule="evenodd"
                    d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z"
                    clip-rule="evenodd" />
                </svg>
                Potential Rewards
              </h4>

              <ul class="space-y-3">
                <li class="flex items-center justify-between text-sm">
                  <span class="text-slate-600">Standard Win</span>
                  <span class="font-bold text-slate-900 flex items-center gap-1">{{matchStore.COIN_BASE_WIN}} <span
                      class="text-amber-500 text-xs"><Coins class="size-5 lg:size-6 text-yellow-600"/></span></span>
                </li>
                <li class="flex items-center justify-between text-sm">
                  <span class="text-slate-600">Win with Capote</span>
                  <span class="font-bold flex items-center gap-1">{{matchStore.COIN_CAPOTE_MULTIPIER}} <span
                      class="text-amber-500 text-xs"><Coins class="size-5 lg:size-6 text-yellow-600"/></span></span>
                </li>
                <li class="flex items-center justify-between text-sm">
                  <span class="text-slate-600">Win with Bandeira</span>
                  <span class="font-bold flex items-center gap-1">{{matchStore.COIN_BANDEIRA_MULTIPIER}} <span
                      class="text-amber-500 text-xs"><Coins class="size-5 lg:size-6 text-yellow-600"/></span></span>
                </li>
              </ul>
            </div>

            <!-- Warning Box -->
            <div class="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-3 items-start">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                class="w-5 h-5 text-amber-600 shrink-0 mt-0.5">
                <path fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clip-rule="evenodd" />
              </svg>
              <p class="text-xs text-amber-800 leading-relaxed">
                Upon confirmation, <span class="font-bold">3 coins</span> will be immediately deducted from your account
                balance.
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="text-center p-2 bg-rose-50 rounded border border-rose-100">
              <p class="text-xs text-rose-600 font-semibold">{{ errorMessage }}</p>
            </div>

            <!-- Actions -->
            <div class="grid grid-cols-2 gap-3 pt-2">
              <button @click="open = false"
                class="px-4 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors text-sm">
                Cancel
              </button>
              <button @click="confirmPayment"
                class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-lg shadow-emerald-200 transition-all transform active:scale-95 text-sm flex items-center justify-center gap-2">
                <span>Confirm & Play</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <path fill-rule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import axios from "axios";
import { Coins } from "lucide-vue-next";
import { useMatchStore } from "@/stores/match";
import { useAPIStore } from "@/stores/api.js";

const authStore = useAuthStore();
const router = useRouter();
const matchStore = useMatchStore()
const open = ref(false);
const errorMessage = ref("");
const gameCost = 3;
const apiStore = useAPIStore();


async function confirmPayment() {
  try {

    if (!authStore.currentUser || authStore.currentUser.coins_balance < gameCost) {
      errorMessage.value = "Not enough coins to play.";
      return;
    }


    /* Comentar isto se tiver a dar erro a começar jogo */
    const startGame = await apiStore.sendStartGame();
    const user = startGame.data;
    /* ate aqui */


    // const { data: user } = await axios.post("https://redycore.dpdns.org/api/start-game"); // descomentar se tiver a dar erro a começar jogo

    authStore.currentUser = user;

    router.push("/games/singleplayer");

  } catch (err: any) {

    if (err.response?.data?.message) {
      alert(err.response.data.message);
    } else {
      alert("Erro ao iniciar o jogo");
    }
  }
}

function startGame(isRanked) {
  if (!authStore.isLoggedIn || !isRanked) {
    router.push("/games/singleplayer");
    return;
  }
  open.value = true;
}

</script>