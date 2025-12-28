<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDashStore } from '@/stores/dash.js'
import { useAuthStore } from '@/stores/auth.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar } from 'vue-chartjs'
import { Loader2, Users, Gamepad2, Swords, TrendingUp, ShoppingCart, Clock, Hourglass } from 'lucide-vue-next'
import adminBar from '@/components/admin/adminBar.vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const dashStore = useDashStore()
const authStore = useAuthStore()

const stats = ref(null)
const loading = ref(true)

const isAdmin = computed(() => authStore.isAdmin)

const formatDuration = (seconds) => {
    if (!seconds) return '0s'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.round(seconds % 60)
    
    if (h > 0) return `${h}h ${m}m`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
}

onMounted(async () => {
  try {
    const res = await dashStore.getStatistics()
    stats.value = res.data
  } catch (e) {
    console.error('Failed to load statistics:', e)
  } finally {
    loading.value = false
  }
})

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    }
  }
}

// Matches Chart Data
const matchesChartData = computed(() => {
  if (!stats.value?.matches_by_period) return null
  
  const labels = stats.value.matches_by_period.map(item => item.date)
  const data = stats.value.matches_by_period.map(item => item.count)
  
  return {
    labels,
    datasets: [
      {
        label: 'Matches Played',
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        data
      }
    ]
  }
})

// Purchases Chart Data
const purchasesChartData = computed(() => {
  if (!stats.value?.purchases_by_period) return null
  
  const labels = stats.value.purchases_by_period.map(item => item.date)
  const data = stats.value.purchases_by_period.map(item => item.total_coins) // Using total coins spent
  
  return {
    labels,
    datasets: [
      {
        label: 'Coins Spent',
        backgroundColor: '#f59e0b',
        data
      }
    ]
  }
})

// Matches by Type Chart Data (if available)
const matchesByTypeChartData = computed(() => {
    if (!stats.value?.matches_by_type) return null

    const labels = stats.value.matches_by_type.map(item => item.type)
    const data = stats.value.matches_by_type.map(item => item.count)

    return {
        labels,
        datasets: [
            {
                label: 'Matches by Type',
                backgroundColor: ['#10b981', '#6366f1', '#ec4899', '#8b5cf6'],
                data
            }
        ]
    }
})

</script>

<template>
  <adminBar />

  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Dashboard Statistics</h1>

    <div v-if="loading" class="flex justify-center py-12">
      <Loader2 class="animate-spin size-12 text-gray-400" />
    </div>

    <div v-else-if="stats" class="space-y-8">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 border border-gray-100">
          <div class="p-3 bg-blue-100 rounded-full text-blue-600">
            <Users class="size-8" />
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Total Players</p>
            <p class="text-2xl font-bold">{{ stats.total_players }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 border border-gray-100">
          <div class="p-3 bg-green-100 rounded-full text-green-600">
            <Gamepad2 class="size-8" />
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Total Games</p>
            <p class="text-2xl font-bold">{{ stats.total_games }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 border border-gray-100">
          <div class="p-3 bg-purple-100 rounded-full text-purple-600">
            <Swords class="size-8" />
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Total Matches</p>
            <p class="text-2xl font-bold">{{ stats.total_matches }}</p>
          </div>
        </div>
      </div>

      <!-- Duration Cards (Admin Only or Public? Plan said Admin Only for detailed stats, but averages could be public. Let's keep them with Admin for now as per request flow) -->
      <div v-if="isAdmin" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 border border-gray-100">
            <div class="p-3 bg-indigo-100 rounded-full text-indigo-600">
                <Clock class="size-8" />
            </div>
            <div>
                <p class="text-sm text-gray-500 font-medium">Avg Game Duration</p>
                <p class="text-2xl font-bold">{{ formatDuration(stats.avg_game_duration) }}</p>
            </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 border border-gray-100">
            <div class="p-3 bg-pink-100 rounded-full text-pink-600">
                <Hourglass class="size-8" />
            </div>
            <div>
                <p class="text-sm text-gray-500 font-medium">Avg Match Duration</p>
                <p class="text-2xl font-bold">{{ formatDuration(stats.avg_match_duration) }}</p>
            </div>
        </div>
      </div>

      <!-- Admin Only Section -->
      <div v-if="isAdmin" class="space-y-8">
        
        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Matches Over Time -->
          <div v-if="matchesChartData" class="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div class="flex items-center gap-2 mb-4">
                <TrendingUp class="size-5 text-gray-500" />
                <h2 class="text-xl font-semibold">Matches Activity</h2>
            </div>
            <div class="h-64">
              <Line :data="matchesChartData" :options="chartOptions" />
            </div>
          </div>

          <!-- Purchases Over Time -->
          <div v-if="purchasesChartData" class="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div class="flex items-center gap-2 mb-4">
                <ShoppingCart class="size-5 text-gray-500" />
                <h2 class="text-xl font-semibold">Shop Purchases (Coins)</h2>
            </div>
            <div class="h-64">
              <Bar :data="purchasesChartData" :options="chartOptions" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Top Spenders Table -->
            <div v-if="stats.purchases_by_player && stats.purchases_by_player.length > 0" class="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100">
                <h2 class="text-xl font-semibold">Top Spenders</h2>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                    <th class="px-6 py-3">Rank</th>
                    <th class="px-6 py-3">User</th>
                    <th class="px-6 py-3 text-right">Coins</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-for="(player, index) in stats.purchases_by_player" :key="player.user_id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 font-medium text-gray-500">#{{ index + 1 }}</td>
                    <td class="px-6 py-4">
                        <div class="font-medium text-gray-900">{{ player.user?.nickname || player.user?.name || 'Unknown' }}</div>
                    </td>
                    <td class="px-6 py-4 text-right font-semibold text-amber-600">{{ player.total_coins }}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>

            <!-- Top Time Spent Table -->
            <div v-if="stats.top_time_spent && stats.top_time_spent.length > 0" class="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <div class="p-6 border-b border-gray-100">
                    <h2 class="text-xl font-semibold">Most Active Players (Time)</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th class="px-6 py-3">Rank</th>
                                <th class="px-6 py-3">User</th>
                                <th class="px-6 py-3 text-right">Time Played</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="(player, index) in stats.top_time_spent" :key="player.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 font-medium text-gray-500">#{{ index + 1 }}</td>
                                <td class="px-6 py-4">
                                    <div class="font-medium text-gray-900">{{ player.nickname || player.name || 'Unknown' }}</div>
                                </td>
                                <td class="px-6 py-4 text-right font-semibold text-blue-600">{{ formatDuration(player.total_seconds) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

      </div>
      
      <div v-else class="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p>Log in as an administrator to see detailed statistics and charts.</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles here if needed */
</style>