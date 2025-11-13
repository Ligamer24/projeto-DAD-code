<template>
  <section class="snap-start w-full px-4 mt-6 lg:mt-12">
    <div class="flex flex-col items-center text-center w-full max-w-5xl mx-auto">
      <!-- Title -->
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-widest text-rose-800 w-full text-center flex items-center justify-center gap-3">
        Leaderboard
      </h2>

      <!-- Cards Grid -->
      <div
          class="mt-10 grid gap-6 w-full sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
            v-for="(player, index) in leaderboardData.data"
            :key="player.nickname"
            class="relative group flex flex-col items-center p-5 rounded-2xl border-4 shadow-lg bg-gradient-to-b from-amber-50 to-amber-200 border-yellow-700 hover:scale-[1.03] hover:shadow-2xl transition duration-300"
            :class="{
            'from-yellow-200 to-yellow-400  shadow-[0_0_25px_#facc15]': index === 0 && leaderboardData.current_page === 1,
            'from-amber-100 to-yellow-300  shadow-[0_0_20px_#fbbf24]': index === 1 && leaderboardData.current_page === 1,
            'from-yellow-100 to-amber-200  shadow-[0_0_15px_#fcd34d]': index === 2 && leaderboardData.current_page === 1,
            '!border-green-600': currentUser === player.id,
          }"
        >
          <!-- Rank Badge -->
          <div
              class="absolute -top-3 -left-3 min-w-9 h-9 px-2 flex items-center justify-center gap-1 rounded-full font-bold text-white shadow-md"
              :class="{
              'bg-yellow-500': index === 0 && leaderboardData.current_page === 1,
              'bg-gray-400': index === 1 && leaderboardData.current_page === 1,
              'bg-orange-500': index === 2 && leaderboardData.current_page === 1,
              'bg-yellow-700': index > 2 || leaderboardData.current_page !== 1,
            }"
          >
            <Crown v-if="index === 0 && leaderboardData.current_page === 1" class="text-white w-4 h-4"/>
            <Medal v-else-if="index === 1 && leaderboardData.current_page === 1" class="text-white w-4 h-4"/>
            <Trophy v-else-if="index === 2 && leaderboardData.current_page === 1" class="text-white w-4 h-4"/>
            <span class="leading-none">
              {{ index + 1 + ((leaderboardData.current_page - 1) * leaderboardData.per_page) }}
            </span>
          </div>
          <div
              v-if="currentUser === player.id"
              class="absolute -top-3 -right-3 min-w-9 h-9 px-2 flex items-center justify-center gap-1 rounded-full font-bold text-white shadow-md bg-green-600"
          >
            You
          </div>

          <!-- Avatar -->
          <div class="relative">
            <img
                :src="`${baseUrl}/storage/photos_avatars/${player.photo_avatar_filename ?? 'anonymous.png'}`"
                :alt="`${player.nickname || player.name} avatar`"
                class="w-24 h-24 rounded-full border-4 border-yellow-500 object-cover shadow-md"
            />
            <div
                v-if="index < 3"
                class="absolute inset-0 rounded-full ring-4 ring-yellow-400/80 ring-offset-2 ring-offset-amber-50 pointer-events-none"
            ></div>
          </div>

          <!-- Player Info -->
          <h3 class="mt-4 text-xl font-bold text-rose-900">
            {{ player.nickname || player.name }}
          </h3>
          <p class="text-sm text-gray-700 italic">{{ player.name }}</p>

          <!-- Rating -->
          <div
              class="mt-4 px-5 py-2 rounded-xl bg-yellow-100 border-2 border-yellow-600 text-yellow-900 font-bold shadow-inner flex items-center gap-2"
          >
            <Star class="text-yellow-600 w-5 h-5"/>
            {{ player.rating }}
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
          v-if="leaderboardData?.last_page > 1"
          class="flex justify-center mt-10 gap-3"
      >
        <button
            class="px-4 py-2 rounded-lg border-2 border-yellow-600 bg-amber-200 hover:bg-amber-300 transition disabled:opacity-50 flex items-center gap-2"
            :disabled="leaderboardData.current_page === 1"
            @click="fetchLeaderboard(leaderboardData.current_page - 1)"
            aria-label="Previous page"
        >
          <ChevronLeft class="w-5 h-5"/>
          <span class="sr-only">Previous</span>
        </button>

        <span class="px-3 py-2 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
          Page {{ leaderboardData.current_page }} / {{ leaderboardData.last_page }}
        </span>

        <button
            class="px-4 py-2 rounded-lg border-2 border-yellow-600 bg-amber-200 hover:bg-amber-300 transition disabled:opacity-50 flex items-center gap-2"
            :disabled="leaderboardData.current_page === leaderboardData.last_page"
            @click="fetchLeaderboard(leaderboardData.current_page + 1)"
            aria-label="Next page"
        >
          <span class="sr-only">Next</span>
          <ChevronRight class="w-5 h-5"/>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {inject, onMounted, ref} from 'vue'
import {useDashStore} from '@/stores/dash'
import {useAuthStore} from '@/stores/auth'
// Use lucide-vue-next icons
import {ChevronLeft, ChevronRight, Crown, Medal, Star, Trophy} from 'lucide-vue-next'

const dashStore = useDashStore()
const baseUrl = inject('baseURL')

const currentUser = useAuthStore().currentUser.id

const leaderboardData = ref({
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 10,
})

async function fetchLeaderboard(page = 1) {
  const res = await dashStore.getLeaderboard(page)
  leaderboardData.value.data = res.data
  leaderboardData.value.current_page = res.current_page
  leaderboardData.value.last_page = res.last_page
  leaderboardData.value.per_page = res.per_page
}

onMounted(() => fetchLeaderboard())
</script>