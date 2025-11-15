<script setup>
import {Coins, Crown, ExpandIcon, Trophy, UserRound} from "lucide-vue-next";
import {RouterLink} from "vue-router";
import {ref, computed, onMounted, watch} from "vue";
import {useDashStore} from "@/stores/dash.js";
import {useAuthStore} from "@/stores/auth.js";

const dash = ref({
  coins_balance: 0,
  rating: 0,
  rank: null,
  nickname: null,
  name: null
});
const logged = ref(false);

const profileLink = computed(() => (logged.value ? "/profile" : "/login"));

const loadDash = async () => {
  const api = useDashStore();
  const auth = useAuthStore();
  logged.value = auth?.isLoggedIn ?? false;
  if (!logged.value) {
    // keep safe defaults when not logged
    dash.value.coins_balance = 0;
    dash.value.rating = 0;
    dash.value.rank = null;
    return;
  }
  try {
    const res = await api.getDash();
    dash.value = res.data;
  } catch (e) {
    console.error("Failed to load dash:", e);
    dash.value.coins_balance = dash.value.coins_balance ?? 0;
    dash.value.rating = dash.value.rating ?? 0;
    dash.value.rank = dash.value.rank ?? null;
  }
};

onMounted(loadDash);


</script>
<script>

export default {
  name: "navbar",
};

</script>

<template>
  <header class="container mx-auto px-4 pt-5">
    <div class="flex items-center justify-between gap-4">
      <!-- Profile / Nickname -->
      <RouterLink :to="profileLink" class="flex items-center gap-2 group" aria-label="Open profile">
        <div
            class="size-9 rounded-full bg-white/80 border border-black/40 grid place-items-center group-hover:bg-white transition">
          <UserRound class="size-5 text-emerald-700"/>
        </div>
        <span class="text-lg lg:text-xl font-semibold text-black group-hover:underline">{{
            dash.nickname ?? dash.name ?? 'Anonymous'
          }}</span>
      </RouterLink>

      <!-- Rating & Rank -->
      <RouterLink to="/leaderboard" class="flex items-center flex-col leading-tight group"
                  aria-label="Open leaderboard">
        <span class="flex gap-2 text-sm font-semibold text-black">
          <Trophy class="size-4 text-emerald-700"/>
          Rating: {{ dash.rating }}
        </span>
        <span class="flex gap-2 text-xs text-black/70 group-hover:text-black opacity-80">
          <Crown class="size-4 text-amber-700"/>
          <span v-if="dash.rank !== null && dash.rank !== undefined">Rank #{{ dash.rank }}</span>
          <span v-else>No rank</span>
        </span>
      </RouterLink>

      <!-- Coins -->
      <RouterLink to="/shop" class="flex items-center gap-1 text-black">
        <span class="text-lg lg:text-xl font-bold">{{ dash.coins_balance }}</span>
        <Coins class="size-5 lg:size-6 text-yellow-600"/>
      </RouterLink>
    </div>
    <div class="mt-2 h-px w-full bg-black/40"/>
  </header>
</template>

<style scoped>

</style>