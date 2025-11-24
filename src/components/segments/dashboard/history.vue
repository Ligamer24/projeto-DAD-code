<script>
import MatchList from '@/components/MatchList.vue';
import GameList from '@/components/GameList.vue';
export default {
  components: {
    MatchList,
    GameList,
  }
};
</script>

<template>
  <section class="snap-start snap-always w-full shrink-0 px-4 mt-6 lg:mt-12">
    <div class="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-xl mx-auto">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-widest text-rose-800 w-full text-center">
        MATCH HISTORY
      </h2>

      <div class="w-full mt-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 w-full">
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button @click="selectMatches"
              :class="['hover:cursor-pointer px-3 py-1 rounded w-full sm:w-auto', !gamesAvailableSelected ? 'bg-rose-700 text-white' : 'bg-white text-slate-700']">
              Matches
            </button>
            <button @click="selectGames"
              :class="['hover:cursor-pointer px-3 py-1 rounded w-full sm:w-auto', gamesAvailableSelected ? 'bg-rose-700 text-white' : 'bg-white text-slate-700']">
              Individual games
            </button>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto ml-0 sm:ml-auto">
            <span>Result: </span>
            <select class="border-2 border-solid bg-white border-rose-600 w-full sm:w-auto" v-model="selectedResult">
              <option value="all">All</option>
              <option value="victory">Victory</option>
              <option value="defeat">Defeat</option>
              <option value="draw">Draw</option>
            </select>

            <span>Order: </span>
            <select class="border-2 border-solid bg-white border-rose-600 w-full sm:w-auto" v-model="selectedSortOrder">
              <option value="asc">Oldest first</option>
              <option value="desc">Newest first</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row lg:items-end gap-4 mb-6 w-full">
          <div class="flex flex-col sm:flex-row gap-2 flex-1 w-full">
            <input class="border-2 border-solid bg-white border-rose-600 px-2 py-1 rounded w-full sm:w-auto" type="date"
              v-model="selectedFrom" />
            <input class="border-2 border-solid bg-white border-rose-600 px-2 py-1 rounded w-full sm:w-auto" type="date"
              v-model="selectedTo" />
          </div>

          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button @click="applyDateFilter"
              class="px-3 py-1 rounded bg-rose-700 text-white hover:bg-rose-800 w-full sm:w-auto">
              Filter by date
            </button>
            <button @click="clearDateFilter" class="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 w-full sm:w-auto">
              Clear
            </button>
          </div>
        </div>

        <div v-if="!gamesAvailableSelected">
          <MatchList :filter-result="selectedResult" :sortOrder="selectedSortOrder" :from="fromDate" :to="toDate"
            ref="matchListRef" />
        </div>
        <div v-else>
          <GameList :filter-result="selectedResult" :sortOrder="selectedSortOrder" :from="fromDate" :to="toDate"
            ref="gameListRef" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';

const selectedResult = ref("all");
const selectedSortOrder = ref("desc");

const selectedFrom = ref(null);
const selectedTo = ref(null);
const fromDate = ref(null);
const toDate = ref(null);


const matchListRef = ref(null);
const gameListRef = ref(null);

const gamesAvailableSelected = ref(false);

function selectGames() {
  gamesAvailableSelected.value = true;
}

function selectMatches() {
  gamesAvailableSelected.value = false;
}

function applyDateFilter() {
  fromDate.value = selectedFrom.value;
  toDate.value = selectedTo.value;

  if (!gamesAvailableSelected.value) {
    matchListRef.value?.loadPage(1);
  } else {
    gameListRef.value?.loadPage(1);
  }
}

function clearDateFilter() {
  selectedFrom.value = null;
  selectedTo.value = null;
  fromDate.value = null;
  toDate.value = null;

  if (!gamesAvailableSelected.value) {
    matchListRef.value?.loadPage(1);
  } else {
    gameListRef.value?.loadPage(1);
  }
}

watch([selectedFrom, selectedTo], ([from, to]) => {
  if (from && to && to < from) {
    selectedTo.value = from;
  }
});


</script>
