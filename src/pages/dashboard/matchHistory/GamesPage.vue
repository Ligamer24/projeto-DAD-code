<template>
    <section class="snap-start snap-always w-full shrink-0 px-4 mt-6 lg:mt-12">
        <div class="max-w-3xl mx-auto">
            <div class="flex flex-col items-center lg:items-start text-center lg:text-left w-full">
                <h2
                    class="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-widest text-rose-800 w-full text-center">
                    MATCH GAMES
                </h2>
                <div class="mt-3 w-full flex justify-center lg:justify-start">
                    <RouterLink :to="{ name: 'history' }"
                        class="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-rose-700 bg-white hover:bg-rose-50 border-solid border-2">
                        ← Back to history
                    </RouterLink>
                </div>
            </div>

            <div class="mt-6 bg-white/90 rounded-xl shadow p-6">
                <div class="mb-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div class="text-sm text-slate-900 font-medium w-full text-center sm:text-left sm:w-auto">
                        Match ID: #{{ matchId ?? '-' }}
                    </div>

                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                        <span class="block sm:inline">Filter by achievements:</span>
                        <select class="border-2 border-solid bg-white border-rose-600 w-full sm:w-auto"
                            v-model="selectedAchievement">
                            <option value="none">None</option>
                            <option value="capote">Capote</option>
                            <option value="bandeira">Bandeira</option>
                        </select>
                    </div>
                </div>

                <div v-if="loading" class="text-center py-8">Loading games...</div>
                <div v-else-if="error" class="text-center text-red-600 py-4">Error: {{ error }}</div>

                <div v-else>
                    <div v-if="filteredGames.length === 0" class="text-center text-slate-600 py-6">
                        No games found for this match.
                    </div>

                    <ul v-else class="space-y-3">
                        <li v-for="g in filteredGames" :key="g.id"
                            class="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/60 p-3 rounded shadow-sm">
                            <div class="flex flex-col sm:flex-row items-center sm:items-center gap-3 w-full sm:w-auto">
                                <div class="min-w-0 text-center sm:text-left">
                                    <div class="font-medium truncate">vs {{ history.opponentName(g) }}</div>
                                    <div class="text-xs text-slate-500 truncate">
                                        {{ history.formatDate(g.began_at) }} • {{ history.formatDuration(g) }}
                                    </div>
                                </div>

                                <div class="flex items-center gap-2 mt-2 sm:mt-0">
                                    <span v-if="g.id"
                                        class="text-xs text-slate-500 px-2 py-0.5 rounded border border-slate-100 font-mono">
                                        #{{ g.id }}
                                    </span>
                                </div>
                            </div>

                            <div
                                class="flex flex-col sm:flex-row items-center sm:items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
                                <div class="text-center sm:text-right w-full sm:w-auto">
                                    <div class="font-semibold text-lg">
                                        {{ g.player1_points ?? '-' }} : {{ g.player2_points ?? '-' }}
                                    </div>
                                    <div :class="history.resultClass(g)">{{ history.resultLabel(g) }}</div>
                                </div>
                                <RouterLink :to="{ name: 'MatchDetails', params: { id: g.id } }"
                                    class="inline-flex w-full sm:w-auto justify-center items-center px-3 py-1 rounded-md text-sm font-medium text-white bg-rose-700 hover:bg-rose-800"
                                    aria-label="See game details">
                                    See game
                                </RouterLink>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>



<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useDashStore } from '@/stores/dash';
import { useHistoryStore } from '@/stores/historyStore';

const route = useRoute();
const dash = useDashStore();    
const history = useHistoryStore();


const matchId = ref(route.params.id);

const games = ref([]);
const loading = ref(false);
const error = ref(null);
const selectedAchievement = ref('none');

async function loadGames() {
    if (!matchId.value) return;
    loading.value = true;
    error.value = null;
    try {
        const res = await dash.getGamesByMatch(matchId.value);
        const payload = res.data || res;
        games.value = payload.data || payload || [];
    } catch (e) {
        error.value = e?.message || String(e);
    } finally {
        loading.value = false;
    }
}

const filteredGames = computed(() => {
    let gamesFiltered = [];

    games.value.forEach(g => {
        if (selectedAchievement.value === 'bandeira' && (g.player1_points === 120 || g.player2_points === 120)) {
            gamesFiltered.push(g);
        }
        else if (selectedAchievement.value === 'capote' && (g.player1_points >= 91 || g.player2_points >= 91)) {
            gamesFiltered.push(g);
        }
        else if (selectedAchievement.value === 'none') {
            gamesFiltered.push(g);
        }
    });

    return gamesFiltered;
});


onMounted(() => {
    loadGames();
});
</script>
