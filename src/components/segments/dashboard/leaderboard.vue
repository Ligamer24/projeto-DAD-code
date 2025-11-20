<template>
  <section class="snap-start w-full px-4 mt-6 lg:mt-12">
    <div class="flex flex-col items-center text-center w-full max-w-5xl mx-auto">
      <!-- Title -->
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-widest text-rose-800 w-full text-center flex items-center justify-center gap-3">
        Leaderboard
      </h2>

      <!-- View Mode Toggle (styled, simple, no animations) -->
      <div class="mt-6">
        <div class="inline-flex rounded-xl border-4 border-amber-700 bg-gradient-to-b from-amber-50 to-amber-100 shadow-md overflow-hidden">
          <button
            @click="switchMode('global')"
            :class="[
              'px-6 py-2 text-sm font-bold tracking-wide focus:outline-none',
              viewMode === 'global'
                ? 'bg-amber-300 text-amber-900 shadow-inner'
                : 'text-amber-700'
            ]"
          >
            Global
          </button>
          <button
            @click="switchMode('player')"
            :class="[
              'px-6 py-2 text-sm font-bold tracking-wide border-l-4 border-amber-700 focus:outline-none',
              viewMode === 'player'
                ? 'bg-green-300 text-green-900 shadow-inner'
                : 'text-green-700'
            ]"
          >
            My Stats
          </button>
        </div>
      </div>

      <!-- Sorting (styled simple pills, no animations) -->
      <div v-if="viewMode === 'global'" class="mt-6 w-full max-w-xl">
        <div class="px-5 py-4 rounded-xl border-4 border-yellow-700 bg-gradient-to-b from-yellow-50 to-amber-100 shadow-md">
          <div class="flex items-center justify-center flex-wrap gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-yellow-900 mr-2">Sort:</span>
            <button
              v-for="key in sortOptions"
              :key="key.value"
              @click="toggleSort(key.value)"
              :class="[
                'px-3 py-1.5 rounded-full text-xs border font-medium',
                sortKey === key.value
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-inner'
                  : 'bg-white text-gray-700 border-gray-300'
              ]"
            >
              {{ key.label }}
            </button>
            <button
              v-if="sortKey"
              @click="clearSort"
              class="px-3 py-1.5 rounded-full text-xs border font-medium bg-white text-red-700 border-red-400"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Player personal stats (only in player view & logged) -->
      <div v-if="viewMode==='player'" class="mt-10 w-full max-w-4xl">
        <div v-if="!isLoggedIn"
             class="p-8 rounded-xl bg-gradient-to-b from-amber-100 to-yellow-200 border-4 border-amber-500 shadow-xl">
          <div class="text-center">
            <div
                class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-4 border-amber-700 flex items-center justify-center shadow-lg">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-amber-900 mb-2">Login Required</h3>
            <p class="text-amber-800 font-semibold">Sign in to view your personal game statistics.</p>
          </div>
        </div>

        <div v-else class="space-y-6">
          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- Matches Played -->
            <div class="relative flex flex-col rounded-2xl bg-white border-4 border-blue-600 shadow-[0_4px_0_0_theme(colors.blue.800)]">
              <div class="px-4 py-2 flex items-center justify-between bg-blue-50 border-b-2 border-blue-200 rounded-t-xl">
                <span class="text-xs font-bold uppercase tracking-wider text-blue-700">Total Matches</span>
                <span class="text-lg font-black text-blue-500">♠</span>
              </div>
              <div class="p-4 flex-1 flex flex-col justify-center">
                <div class="w-12 h-12 mb-3 rounded-xl bg-blue-600 flex items-center justify-center border-2 border-blue-800 shadow-inner">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/>
                  </svg>
                </div>
                <p class="text-4xl font-black text-blue-900 leading-none">{{ personalScore?.matches ?? 0 }}</p>
              </div>
            </div>

            <!-- Wins -->
            <div class="relative flex flex-col rounded-2xl bg-white border-4 border-green-600 shadow-[0_4px_0_0_theme(colors.green.800)]">
              <div class="px-4 py-2 flex items-center justify-between bg-green-50 border-b-2 border-green-200 rounded-t-xl">
                <span class="text-xs font-bold uppercase tracking-wider text-green-700">Victories</span>
                <span class="text-lg font-black text-green-600">♣</span>
              </div>
              <div class="p-4 flex-1 flex flex-col justify-center">
                <div class="w-12 h-12 mb-3 rounded-xl bg-green-600 flex items-center justify-center border-2 border-green-800 shadow-inner">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p class="text-4xl font-black text-green-900 leading-none">{{ personalScore?.wins ?? 0 }}</p>
              </div>
            </div>

            <!-- Win Rate -->
            <div class="relative flex flex-col rounded-2xl bg-white border-4 border-purple-600 shadow-[0_4px_0_0_theme(colors.purple.800)]">
              <div class="px-4 py-2 flex items-center justify-between bg-purple-50 border-b-2 border-purple-200 rounded-t-xl">
                <span class="text-xs font-bold uppercase tracking-wider text-purple-700">Win Rate</span>
                <span class="text-lg font-black text-purple-600">♦</span>
              </div>
              <div class="p-4 flex-1 flex flex-col justify-center">
                <div class="w-12 h-12 mb-3 rounded-xl bg-purple-600 flex items-center justify-center border-2 border-purple-800 shadow-inner">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
                <p class="text-4xl font-black text-purple-900 leading-none">{{ personalScore?.win_rate ?? '0%' }}</p>
                <div class="mt-3 w-full bg-purple-200 rounded-full h-3 border-2 border-purple-500 overflow-hidden">
                  <div
                    class="h-full bg-purple-600"
                    :style="{ width: personalScore?.win_rate ?? '0%' }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Capote -->
            <div class="relative flex flex-col rounded-2xl bg-white border-4 border-orange-600 shadow-[0_4px_0_0_theme(colors.orange.800)]">
              <div class="px-4 py-2 flex items-center justify-between bg-orange-50 border-b-2 border-orange-200 rounded-t-xl">
                <span class="text-xs font-bold uppercase tracking-wider text-orange-700">Capote</span>
                <span class="text-lg font-black text-red-500">♥</span>
              </div>
              <div class="p-4 flex-1 flex flex-col justify-center">
                <div class="w-12 h-12 mb-3 rounded-xl bg-orange-600 flex items-center justify-center border-2 border-orange-800 shadow-inner">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                </div>
                <p class="text-4xl font-black text-orange-900 leading-none">{{ personalScore?.capote ?? 0 }}</p>
              </div>
            </div>

            <!-- Bandeira -->
            <div class="relative flex flex-col rounded-2xl bg-white border-4 border-red-600 shadow-[0_4px_0_0_theme(colors.red.800)]">
              <div class="px-4 py-2 flex items-center justify-between bg-red-50 border-b-2 border-red-200 rounded-t-xl">
                <span class="text-xs font-bold uppercase tracking-wider text-red-700">Bandeira</span>
                <span class="text-lg font-black text-red-600">♦</span>
              </div>
              <div class="p-4 flex-1 flex flex-col justify-center">
                <div class="w-12 h-12 mb-3 rounded-xl bg-red-600 flex items-center justify-center border-2 border-red-800 shadow-inner">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
                  </svg>
                </div>
                <p class="text-4xl font-black text-red-900 leading-none">{{ personalScore?.bandeira ?? 0 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cards Grid (global only) -->
      <div v-if="viewMode==='global'" class="mt-10 grid gap-6 w-full sm:grid-cols-2 lg:grid-cols-3">
        <div
            v-for="(player, index) in leaderboardData.data"
            :key="player.nickname ?? player.id"
            class="relative group flex flex-col items-center p-5 rounded-2xl border-4 shadow-lg bg-gradient-to-b from-amber-50 to-amber-200 border-yellow-700 hover:scale-[1.03] hover:shadow-2xl transition duration-300"
            :class="{
            'from-yellow-200 to-yellow-400  shadow-[0_0_25px_#facc15]': index === 0 && leaderboardData.current_page === 1,
            'from-amber-100 to-yellow-300  shadow-[0_0_20px_#fbbf24]': index === 1 && leaderboardData.current_page === 1,
            'from-yellow-100 to-amber-200  shadow-[0_0_15px_#fcd34d]': index === 2 && leaderboardData.current_page === 1,
            '!border-green-600': currentUserId === player.id,
          }"
        >
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
            <span class="leading-none">{{
                index + 1 + ((leaderboardData.current_page - 1) * leaderboardData.per_page)
              }}</span>
          </div>
          <div v-if="currentUserId === player.id"
               class="absolute -top-3 -right-3 min-w-9 h-9 px-2 flex items-center justify-center gap-1 rounded-full font-bold text-white shadow-md bg-green-600">
            You
          </div>
          <div class="relative">
            <img :src="`${baseUrl}/storage/photos_avatars/${player.photo_avatar_filename ?? 'anonymous.png'}`"
                 :alt="`${player.nickname || player.name} avatar`"
                 class="w-24 h-24 rounded-full border-4 border-yellow-500 object-cover shadow-md"/>
            <div v-if="index < 3"
                 class="absolute inset-0 rounded-full ring-4 ring-yellow-400/80 ring-offset-2 ring-offset-amber-50 pointer-events-none"></div>
          </div>
          <h3 class="mt-4 text-xl font-bold text-rose-900">{{ player.nickname || player.name }}</h3>
          <p class="text-sm text-gray-700 italic">{{ player.name }}</p>
          <div
              class="mt-4 px-5 py-2 rounded-xl bg-yellow-100 border-2 border-yellow-600 text-yellow-900 font-bold shadow-inner flex items-center gap-2">
            <Star class="text-yellow-600 w-5 h-5"/>
            {{ player.rating }}
          </div>
          <div class="mt-3 flex gap-4 text-sm font-semibold text-rose-800">
            <span class="px-2 py-1 rounded-md bg-green-100 border border-green-300">W: {{ player.wins ?? 0 }}</span>
            <span class="px-2 py-1 rounded-md bg-red-100 border border-red-300">L: {{ player.losses ?? 0 }}</span>
          </div>
          <div class="mt-3 flex flex-wrap justify-center gap-2 text-xs">
            <span v-if="player.highest_stake !== undefined"
                  class="px-2 py-1 rounded bg-amber-200/70 border border-amber-400 text-amber-900 font-semibold">Coins:
              {{ player.highest_stake }}</span>
            <span v-if="player.achievements !== undefined"
                  class="px-2 py-1 rounded bg-indigo-200/70 border border-indigo-400 text-indigo-900 font-semibold">Achievements:
              {{ player.achievements }}</span>
          </div>
        </div>
      </div>

      <!-- Pagination (global only) -->
      <div v-if="leaderboardData?.last_page > 1 && viewMode==='global'" class="flex justify-center mt-10 gap-4">
        <button
            class="group px-6 py-3 rounded-lg font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 bg-gradient-to-b from-amber-200 to-amber-400 border-4 border-amber-600 text-amber-900 hover:from-amber-300 hover:to-amber-500 shadow-lg hover:shadow-xl disabled:hover:shadow-lg focus:outline-none transform hover:scale-105 disabled:transform-none"
            :disabled="leaderboardData.current_page === 1"
            @click="changePage(leaderboardData.current_page - 1)"
            aria-label="Previous page"
        >
          <ChevronLeft class="w-5 h-5"/>
          <span class="hidden sm:inline uppercase text-sm tracking-wider">Previous</span>
        </button>
        <div
            class="px-6 py-3 rounded-lg bg-gradient-to-b from-white to-amber-50 border-4 border-amber-500 text-amber-900 font-bold shadow-lg flex items-center gap-2">
          <span class="text-sm font-bold">Page</span>
          <span class="text-xl font-black">{{ leaderboardData.current_page }}</span>
          <span class="text-amber-600 font-bold">/</span>
          <span class="text-xl font-black">{{ leaderboardData.last_page }}</span>
        </div>
        <button
            class="group px-6 py-3 rounded-lg font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 bg-gradient-to-b from-amber-200 to-amber-400 border-4 border-amber-600 text-amber-900 hover:from-amber-300 hover:to-amber-500 shadow-lg hover:shadow-xl disabled:hover:shadow-lg focus:outline-none transform hover:scale-105 disabled:transform-none"
            :disabled="leaderboardData.current_page === leaderboardData.last_page"
            @click="changePage(leaderboardData.current_page + 1)"
            aria-label="Next page"
        >
          <span class="hidden sm:inline uppercase text-sm tracking-wider">Next</span>
          <ChevronRight class="w-5 h-5"/>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {computed, inject, onMounted, ref, watch} from 'vue'
import {useDashStore} from '@/stores/dash'
import {useAuthStore} from '@/stores/auth'
import {ChevronLeft, ChevronRight, Crown, Medal, Star, Trophy} from 'lucide-vue-next'

const dashStore = useDashStore()
const authStore = useAuthStore()
const baseUrl = inject('baseURL')

const viewMode = ref<'global' | 'player'>('global')

function switchMode(mode: 'global' | 'player') {
  if (viewMode.value !== mode) viewMode.value = mode
}

const isLoggedIn = computed(() => !!authStore.currentUser?.id)
const currentUserId = computed(() => authStore.currentUser?.id)

const personalScore = ref<any>(null)

async function fetchPersonalScore() {
  if (!isLoggedIn.value) {
    personalScore.value = null
    return
  }
  // Attempt to use store method if exists, fallback ignored
  try {
    if (typeof dashStore.getPersonalScore === 'function') {
      personalScore.value = await dashStore.getPersonalScore()
    } else {
      // Fallback endpoint (adjust if backend differs)
      const res = await fetch(`${baseUrl}/api/leaderboard/personal`, {
        headers: {Accept: 'application/json'}
      })
      if (res.ok) personalScore.value = await res.json()
    }
  } catch {
    personalScore.value = null
  }
}

const leaderboardData = ref({
  data: [] as any[],
  current_page: 1,
  last_page: 1,
  per_page: 10,
})

const sortOptions = [
  {label: 'Wins', value: 'wins'},
  {label: 'Coins', value: 'coins'},
  {label: 'Achievements', value: 'achievements'},
]
const sortKey = ref<string | null>(null)

function toggleSort(key: string) {
  sortKey.value = key === sortKey.value ? null : key
  fetchLeaderboard(1)
}

function clearSort() {
  sortKey.value = null
  fetchLeaderboard(1)
}

async function fetchLeaderboard(page = 1) {
  try {
    const url = new URL(`${baseUrl}/api/leaderboard`)
    url.searchParams.set('page', page.toString())
    if (sortKey.value) url.searchParams.set('order_by', sortKey.value)
    const res = await fetch(url.toString(), {headers: {Accept: 'application/json'}})
    const json = await res.json()
    leaderboardData.value.data = json.data
    leaderboardData.value.current_page = json.current_page
    leaderboardData.value.last_page = json.last_page
    leaderboardData.value.per_page = json.per_page
  } catch (e) {
    // Optional: handle error (toast/log)
  }
}

function changePage(page: number) {
  if (page < 1 || page > leaderboardData.value.last_page) return
  fetchLeaderboard(page)
}

watch(viewMode, (val) => {
  if (val === 'player') fetchPersonalScore()
})

onMounted(() => {
  fetchLeaderboard()
  if (viewMode.value === 'player') fetchPersonalScore()
})
</script>