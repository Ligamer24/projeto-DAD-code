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
  <section class="snap-start snap-always w-full shrink-0 px-4 mt-6 lg:mt-12 mb-12">
    <div class="flex flex-col items-center w-full max-w-4xl mx-auto">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-widest text-rose-800 w-full text-center mb-8">
        MATCH HISTORY
      </h2>

      <div class="w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-rose-100 p-4 sm:p-6 mb-8">
        <!-- Tabs -->
        <div class="flex justify-center mb-6">
          <div class="bg-slate-100 p-1 rounded-lg inline-flex shadow-inner">
            <button @click="selectMatches"
              :class="['px-6 py-2 rounded-md text-sm font-medium transition-all duration-200', !gamesAvailableSelected ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50']">
              Matches
            </button>
            <button @click="selectGames"
              :class="['px-6 py-2 rounded-md text-sm font-medium transition-all duration-200', gamesAvailableSelected ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50']">
              Individual Games
            </button>
          </div>
        </div>

        <!-- Filters Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Result</label>
            <select class="w-full rounded-lg border-slate-200 bg-slate-50 py-2 px-3 text-sm text-slate-700 focus:border-rose-500 focus:ring-rose-500 transition-colors"
              v-model="selectedResult">
              <option value="all">All Results</option>
              <option value="victory">Victory</option>
              <option value="defeat">Defeat</option>
              <option value="draw">Draw</option>
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Order</label>
            <select class="w-full rounded-lg border-slate-200 bg-slate-50 py-2 px-3 text-sm text-slate-700 focus:border-rose-500 focus:ring-rose-500 transition-colors"
              v-model="selectedSortOrder">
              <option value="asc">Oldest first</option>
              <option value="desc">Newest first</option>
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">From</label>
            <input class="w-full rounded-lg border-slate-200 bg-slate-50 py-2 px-3 text-sm text-slate-700 focus:border-rose-500 focus:ring-rose-500 transition-colors" type="date"
              v-model="selectedFrom" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">To</label>
            <input class="w-full rounded-lg border-slate-200 bg-slate-50 py-2 px-3 text-sm text-slate-700 focus:border-rose-500 focus:ring-rose-500 transition-colors" type="date"
              v-model="selectedTo" />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-100">
            <button @click="clearDateFilter"
              class="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              Reset Filters
            </button>
            <button @click="applyDateFilter"
              class="px-6 py-2 rounded-lg text-sm font-medium bg-rose-700 text-white hover:bg-rose-800 shadow-md hover:shadow-lg transition-all active:scale-95">
              Apply Filters
            </button>
        </div>
      </div>

      <div class="w-full">
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
    matchListRef.value?.loadPage(1, fromDate.value, toDate.value);
  } else {
    gameListRef.value?.loadPage(1, fromDate.value, toDate.value);
  }
}


function clearDateFilter() {
  selectedFrom.value = null;
  selectedTo.value = null;
  fromDate.value = null;
  toDate.value = null;

  if (!gamesAvailableSelected.value) {
    matchListRef.value?.loadPage(1, fromDate.value, toDate.value);
  } else {
    gameListRef.value?.loadPage(1, fromDate.value, toDate.value);
  }
}

watch([selectedFrom, selectedTo], ([from, to]) => {
  if (from && to && to < from) {
    selectedTo.value = from;
  }
});


</script>
