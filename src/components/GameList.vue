<template>
    <div v-if="loading" class="text-center py-8">
        Loading history...
    </div>

    <div v-else-if="error" class="text-center text-red-600 py-4">
        Error loading history: {{ error }}
    </div>

    <div v-else>
        <div v-if="games.length === 0" class="text-center text-slate-600 py-6">
            No matches found.
        </div>

        <ul v-else class="space-y-3">
            <li v-for="game in filteredAndSorted" :key="game.id"
                class="flex flex-col sm:flex-row sm:items-center justify-between bg-white/60 p-3 rounded shadow-sm w-full">
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 w-full sm:w-auto">
                    <div class="min-w-0 flex-1">
                        <div class="font-medium truncate">vs {{ history.opponentName(game) }}</div>
                        <div class="text-xs text-slate-500 truncate">
                            {{ history.formatDate(game.began_at) }} • {{ history.formatDuration(game) }}
                        </div>
                    </div>

                    <div
                        class="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto text-center sm:text-left">
                        <span v-if="game.id"
                            class="text-xs text-slate-500 px-2 py-0.5 rounded border border-slate-100 font-mono">
                            #{{ game.id }}
                        </span>

                    </div>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                    <div class="text-center sm:text-right flex-1 sm:flex-none">
                        <div :class="history.resultClass(game)">{{ history.resultLabel(game) }}</div>
                        <div class="text-md text-slate-900 font-semibold mb-2">{{ scoreLabel(game) }}</div>

                        <RouterLink :to="{ name: 'MatchDetails', params: { id: game.id } }"
                            class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-white bg-rose-700 hover:bg-rose-800 w-full sm:w-auto justify-center"
                            aria-label="See game details">
                            See game
                        </RouterLink>
                    </div>
                </div>
            </li>
        </ul>

        <nav v-if="lastPage > 1" class="mt-4 flex flex-row gap-2 justify-center items-center"
            aria-label="Paginação de histórico">
            <button v-for="p in pages" :key="p" @click="loadPage(p)" :aria-current="p === page ? 'page' : null" :class="[
                'px-3 py-1 rounded border min-w-[40px] text-center',
                p === page
                    ? 'bg-rose-700 text-white border-rose-700'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
            ]" :disabled="p === page">
                {{ p }}
            </button>
        </nav>
    </div>
</template>


<script>
export default {
    name: 'GameList',
};
</script>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useDashStore } from '@/stores/dash';
import { RouterLink } from 'vue-router';
import { useHistoryStore } from '@/stores/historyStore';

const props = defineProps({
    filterResult: { type: String, default: 'all' },
    sortOrder: { type: String, default: 'desc' },
    from: { type: String, default: null },
    to: { type: String, default: null },
    achievementCapote: { type: Boolean, default: false },
    achievementBandeira: { type: Boolean, default: false },
});

const auth = useAuthStore();
const dash = useDashStore();
const history = useHistoryStore();

const loading = ref(false);
const error = ref(null);
const games = ref([]);

const page = ref(1);
const lastPage = ref(1);

const filteredGames = computed(() => {
    if (!props.filterResult || props.filterResult === 'all') return games.value;
    return games.value.filter((game) => {
        const meId = auth.currentUser?.id;
        const result = game.is_draw ? 'draw' : game.winner_user_id === meId ? 'victory' : 'defeat';
        return result === props.filterResult;
    });
});

const filteredAndSorted = computed(() => {
    const filtered = filteredGames.value;
    return [...filtered].sort((a, b) => {
        const dateA = a.began_at ? new Date(a.began_at).getTime() : 0;
        const dateB = b.began_at ? new Date(b.began_at).getTime() : 0;
        return props.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
});

async function loadPage(p = 1) {
    loading.value = true;
    error.value = null;
    try {
        const res = await dash.getGames({
            page: p,
            result: props.filterResult === 'all' ? null : props.filterResult,
            sortOrder: props.sortOrder,
            from: props.from,
            to: props.to,
        });
        const payload = res.data || res;
        games.value = payload.data || [];
        page.value = payload.current_page || p;
        lastPage.value = payload.last_page || 1;
    } catch (e) {
        error.value = e?.message || String(e);
    } finally {
        loading.value = false;
    }
}

onMounted(() => loadPage(1));

watch(() => props.sortOrder, () => {
    page.value = 1;
    loadPage(1);
});

const pages = computed(() =>
    Array.from({ length: Math.max(0, Number(lastPage.value) || 0) }, (_, i) => i + 1)
);

function scoreLabel(game) {
    return `${game.player1_points ?? '-'} : ${game.player2_points ?? '-'}`;
}

defineExpose({ loadPage });
</script>
