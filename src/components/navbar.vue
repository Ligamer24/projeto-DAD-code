<script setup>
import {Coins} from "lucide-vue-next";
import {RouterLink} from "vue-router";
import {computed, inject, onMounted, ref} from "vue";
import {useDashStore} from "@/stores/dash.js";
import {useAuthStore} from "@/stores/auth.js";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";

const dash = ref({
  coins_balance: 0,
  rating: 0,
  rank: null,
  nickname: null,
  name: null
});

const authStore = useAuthStore()

const logged = ref(false);

const serverBaseURL = inject("baseURL")
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
    <div class="flex items-center w-full gap-4">
      <!-- Profile / Nickname -->
      <div class="flex items-center gap-4">
        <RouterLink :to="profileLink" class="flex items-center gap-2 group" aria-label="Open profile">
          <Avatar class="size-10 lg:size-12">
            <AvatarImage v-if="authStore.currentUser?.photo_avatar_filename"
                         :src="`${serverBaseURL}/storage/photos_avatars/${authStore.currentUser?.photo_avatar_filename}`"
                         :alt="authStore.currentUser?.name"/>
            <AvatarFallback class="text-4xl">
              {{ authStore.currentUser?.name?.charAt(0).toUpperCase() }}
            </AvatarFallback>
          </Avatar>
          <span class="text-lg lg:text-xl font-semibold text-black group-hover:underline">{{
              authStore.currentUser?.nickname ?? authStore.currentUser?.name ?? 'Anonymous'
            }}</span>
        </RouterLink>
        <RouterLink to="/dashboard" v-if="authStore.isAdmin && $route.path.startsWith('/admin')"
                    class="flex text-black ">
          <button
              class="bg-gray-200 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
            Home
          </button>
        </RouterLink>
        <RouterLink to="/admin/dashboard" v-else-if="authStore.isAdmin"
                    class="flex text-black ">
          <button
              class="bg-gray-200 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
            Admin panel
          </button>
        </RouterLink>
      </div>


      <!-- Rating & Rank -->
      <!-- <RouterLink to="/leaderboard" class="flex items-center flex-col leading-tight group"
                  aria-label="Open leaderboard">
        <span class="flex gap-2 text-sm font-semibold text-black">
          <Trophy class="size-4 text-emerald-700"/>
          Rating: {{ authStore.currentUser.rating }}
        </span>
        <span class="flex gap-2 text-xs text-black/70 group-hover:text-black opacity-80">
          <Crown class="size-4 text-amber-700"/>
          <span v-if="dash.rank !== null && dash.rank !== undefined">Rank #{{ dash.rank }}</span>
          <span v-else>No rank</span>
        </span>
      </RouterLink> -->

      <!-- Coins -->
      <RouterLink v-if="authStore.currentUser" to="/shop" class="ml-auto flex items-center gap-1 text-black">
        <span class="text-lg lg:text-xl font-bold">{{ authStore.currentUser?.coins_balance }}</span>
        <Coins class="size-5 lg:size-6 text-yellow-600"/>
      </RouterLink>
    </div>
    <div class="mt-2 h-px w-full bg-black/40"/>
  </header>
</template>

<style scoped></style>