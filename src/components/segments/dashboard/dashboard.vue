<template>
  <section class="snap-start snap-always w-full shrink-0 px-4 mt-6 lg:mt-12">
    <div class="grid place-items-center gap-8 lg:grid-cols-2">
      <div class="flex flex-col items-center lg:items-start text-center lg:text-left select-none">
        <img src="@/assets/logo.png" alt="Bisca Royal logo" />
      </div>
      <div class="flex flex-col items-center gap-5 w-full">
        <button @click="startGame"
          class="cursor-pointer w-64 sm:w-72 lg:w-80 rounded-md border-2 border-black bg-gradient-to-b 
                 from-gray-200 to-gray-400 px-6 py-3 lg:py-4 text-xl lg:text-2xl font-extrabold text-black 
                 shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgba(0,0,0,0.6)]">
          Start Game
        </button>
      </div>
      <div v-if="open" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl p-6 text-center max-w-sm w-full space-y-6">
          <h2 class="text-2xl font-bold">Entry fee: 3🪙</h2>
          <hr>
          <div class="space-y-2">
            <h2 class="text-2xl font-bold">Rewards 👑</h2>
            <p>Win: 6🪙</p>
            <p>Win with capote: 7🪙</p>
            <p>Win with bandeira: 8🪙</p>
          </div>
          <hr>
          <h4 class="text-red-600 text-xl font-bold">⚠️The coins will be deducted from your account⚠️</h4>
          <hr>
          <div class="flex justify-center gap-4">
            <button @click="open = false" class="px-4 py-2 bg-gray-300 rounded-lg font-bold">Cancelar</button>
            <button @click="confirmPayment" class="px-4 py-2 bg-green-500 text-white rounded-lg font-bold">Play</button>
          </div>
          <div v-if="errorMessage" class="text-red-600 font-bold text-lg">
            {{ errorMessage }}
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


const authStore = useAuthStore();
const router = useRouter();
const open = ref(false);
const errorMessage = ref("");
const gameCost = 3;

async function confirmPayment() {
  try {

    if (!authStore.currentUser || authStore.currentUser.coins_balance < gameCost) {
      errorMessage.value = "Não tens moedas suficientes!";
      return;
    }

    const { data: user } = await axios.post("http://localhost:8000/api/start-game");

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

function startGame() {
  if (!authStore.isLoggedIn) {
    router.push("/games/singleplayer");
    return;
  }
  open.value = true;
}

</script>