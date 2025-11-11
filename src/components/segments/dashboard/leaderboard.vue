<template>
  <section
      class="snap-start snap-always w-full shrink-0 px-4 mt-6 lg:mt-12">
    <div class="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-xl mx-auto">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-widest text-rose-800 w-full text-center">LEADERBOARD</h2>
      <div class="mt-6 w-full overflow-x-auto">
        <table class="w-full table-auto border-collapse border border-black">
          <thead>
          <tr>
            <th class="border border-black px-4 py-2 text-left">Rank</th>
            <th class="border border-black px-4 py-2 text-left">Player</th>
            <th class="border border-black px-4 py-2 text-left">Points</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(player, index) in leaderboardData" :key="player.name" class="hover:bg-gray-100">
            <td class="border border-black px-4 py-2">{{ index + 1 }}</td>
            <td class="border border-black px-4 py-2">{{ player.name }}</td>
            <td class="border border-black px-4 py-2 flex items-center gap-1">
              {{ player.points }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const leaderboardData = [
  {name: 'Ana', points: 300},
  {name: 'Bruno', points: 250},
  {name: 'Carla', points: 200},
  {name: 'Daniel', points: 150},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
  {name: 'Eva', points: 100},
];
</script>