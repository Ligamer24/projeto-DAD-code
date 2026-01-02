<script setup>
import { ref, onMounted } from 'vue'
import { useDashStore } from '@/stores/dash.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { Loader2, Users, Gamepad2, Swords, TrendingUp, Clock, Hourglass } from 'lucide-vue-next'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const dashStore = useDashStore()

const stats = ref(null)
const loading = ref(true)

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
const matchesChartData = (statsData) => {
  if (!statsData?.matches_by_period) return null
  
  const labels = statsData.matches_by_period.map(item => item.date)
  const data = statsData.matches_by_period.map(item => item.count)
  
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
}
</script>

<template>
    <!-- <section class="snap-start snap-always w-full shrink-0 px-4 mt-6 lg:mt-12 mb-12"> -->

  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Dashboard</h1>

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

      <!-- Duration Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <!-- Matches Activity Chart -->
      <div v-if="stats.matches_by_period && stats.matches_by_period.length > 0" class="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div class="flex items-center gap-2 mb-4">
            <TrendingUp class="size-5 text-gray-500" />
            <h2 class="text-xl font-semibold">Matches Activity</h2>
        </div>
        <div class="h-64">
          <Line :data="matchesChartData(stats)" :options="chartOptions" />
        </div>
      </div>

    </div>
  </div>
</template>
