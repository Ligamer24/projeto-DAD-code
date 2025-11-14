<template>
  <section class="snap-start snap-always w-full shrink-0 px-4 mt-6 lg:mt-12">
    <div class="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-xl mx-auto">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-widest text-rose-800 w-full text-center">MATCH HISTORY</h2>

      <div class="w-full mt-6">
        <div class="flex justify-center lg:justify-start gap-2 mb-4">
          <label class="sr-only">Filtrar por MATCH</label>
          <button
            @click="filterMode = 'all'"
            :class="[ 'px-3 py-1 rounded border', filterMode === 'all' ? 'bg-rose-700 text-white border-rose-700' : 'bg-white text-slate-700 hover:bg-slate-100' ]"
          >
            All
          </button>
          <button
            @click="filterMode = 'with'"
            :class="[ 'px-3 py-1 rounded border', filterMode === 'with' ? 'bg-rose-700 text-white border-rose-700' : 'bg-white text-slate-700 hover:bg-slate-100' ]"
          >
            Matches Complete
          </button>
          <button
            @click="filterMode = 'without'"
            :class="[ 'px-3 py-1 rounded border', filterMode === 'without' ? 'bg-rose-700 text-white border-rose-700' : 'bg-white text-slate-700 hover:bg-slate-100' ]"
          >
            Individual Games
          </button>
        </div>
        <div v-if="loading" class="text-center py-8">Loading history...</div>

        <div v-else-if="error" class="text-center text-red-600 py-4">Error loading history: {{ error }}</div>

        <div v-else>
          <div v-if="games.length === 0" class="text-center text-slate-600 py-6">No games found.</div>

          <ul v-else class="space-y-3">
            <li v-for="game in filteredGames" :key="game.id" class="flex items-center justify-between bg-white/60 p-3 rounded shadow-sm">
              <div>
                <div class="text-sm text-slate-500"></div>
                <div class="font-medium">
                  vs {{ opponentName(game) }}
                </div>
                <div v-if="game.match_id !== null" class="mt-1">
                  <span class="inline-block text-xs text-slate-500 bg-white/40 px-2 py-0.5 rounded border border-slate-100 font-mono">
                    Match #{{ game.match_id }}
                  </span>
                </div>
              </div>

              <div class="text-right">
                <div :class="resultClass(game)">{{ resultLabel(game) }}</div>
                <div class="text-sm text-slate-500">{{ scoreLabel(game) }}</div>
              </div>
            </li>
          </ul>

          <nav v-if="lastPage > 1" class="mt-4 flex justify-center items-center gap-2" aria-label="Paginação de histórico">
            <button
              v-for="p in pages"
              :key="p"
              @click="loadPage(p)"
              :aria-current="p === page ? 'page' : null"
              :class="[
                'px-3 py-1 rounded border',
                p === page ? 'bg-rose-700 text-white border-rose-700' : 'bg-white text-slate-700 hover:bg-slate-100'
              ]"
              :disabled="p === page"
            >
              {{ p }}
            </button>
          </nav>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup >
import { ref, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useDashStore } from '@/stores/dash';

const auth = useAuthStore();
const dash = useDashStore();

const loading = ref(false);
const error = ref(null);
const games = ref([]);

const page = ref(1);
const lastPage = ref(1);


const pages = computed(() => {
  const total = Math.max(0, Number(lastPage.value) || 0);
  return Array.from({ length: total }, (_, i) => i + 1);
});

// filter: 'all' | 'with' | 'without'
const filterMode = ref('all');

const filteredGames = computed(() => {
  if (!games.value) return [];
  if (filterMode.value === 'all') return games.value;
  if (filterMode.value === 'with') return games.value.filter(g => g.match_id !== null && g.match_id !== undefined);
  return games.value.filter(g => g.match_id === null || g.match_id === undefined);
});


function opponentName(game) {
  const meId = auth.currentUser?.id;
  if (!meId) return '-';
  if (game.player1 && game.player1.id === meId) return game.player2?.name || 'unknown';
  return game.player1?.name || 'unknown';
}

function resultLabel(game) {
  const meId = auth.currentUser?.id;
  if (game.is_draw) return 'Draw';
  if (!game.winner_user_id) return '—';
  return game.winner_user_id === meId ? 'Victory' : 'Defeat';
}

function resultClass(game) {
  const label = resultLabel(game);
  if (label === 'Victory') return 'text-green-600 font-semibold';
  if (label === 'Defeat') return 'text-red-600 font-semibold';
  return 'text-slate-600';
}

function scoreLabel(game) {
  if (game.player1_points == null && game.player2_points == null) return '';
  return `${game.player1_points ?? '-'} : ${game.player2_points ?? '-'}`;
}

async function loadPage(p = 1) {
  loading.value = true;
  error.value = null;
  try {
    const res = await dash.getHistory(p, filterMode.value === 'all' ? null : filterMode.value);
    const payload = res.data || res;
    // Laravel paginate returns { data: [...], current_page, last_page } --> O stor falou disto na aula //o payload vem com 2 datas ou seja o valor dos games ta no res.data.data
    games.value = payload.data || [];
    page.value = payload.current_page || p;
    lastPage.value = payload.last_page || 1;
  } catch (e) {
    error.value = e?.message || String(e);
  } finally {
    loading.value = false;
  }
}


onMounted(() => {
  loadPage(1);
});

// when filter changes, reload first page using the new filter so server returns correct pagination
watch(filterMode, () => {
  loadPage(1);
});
</script>