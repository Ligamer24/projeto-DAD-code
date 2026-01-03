<template>
    <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-rose-200 border-t-rose-700"></div>
        <div class="mt-2 text-slate-500 text-sm">Loading games...</div>
    </div>

    <div v-else-if="error" class="text-center text-red-600 py-8 bg-red-50 rounded-lg border border-red-100">
        Error loading history: {{ error }}
    </div>

    <div v-else>
        <div v-if="filteredAndSorted.length === 0" class="text-center text-slate-500 py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            No games found matching your criteria.
        </div>

        <ul v-else class="space-y-4">
            <li v-for="game in filteredAndSorted" :key="game.id"
                class="group bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200 hover:border-rose-200 hover:shadow-md transition-all duration-200">

                <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <!-- Date & Meta -->
                    <div class="flex flex-row sm:flex-col items-center sm:items-start justify-between w-full sm:w-auto sm:min-w-[100px] text-slate-500">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {{ history.formatDate(game.began_at) }}
                        </div>
                        <div class="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 mt-0 sm:mt-1">
                            #{{ game.id }}
                        </div>
                    </div>

                    <!-- Game Info -->
                    <div class="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left w-full">
                        <div class="text-xs text-slate-400 font-medium mb-0.5">OPPONENT</div>
                        <div class="text-lg font-bold text-slate-800 group-hover:text-rose-700 transition-colors truncate w-full">
                            {{ history.opponentName(game) }}
                        </div>

                        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 mt-2 text-xs text-slate-500">
                            <div class="flex items-center gap-1.5" title="Game Type">
                                <Gamepad2 class="w-3.5 h-3.5 text-slate-400" />
                                <span class="font-medium">{{ game.type || 'Bisca' }}</span>
                            </div>
                            <div class="flex items-center gap-1.5" title="Duration">
                                <Clock class="w-3.5 h-3.5 text-slate-400" />
                                <span>{{ history.formatDuration(game) }}</span>
                            </div>
                            <div class="flex items-center gap-1.5" title="Marks Earned">
                                <Trophy class="w-3.5 h-3.5 text-slate-400" />
                                <span>{{ history.myMarks(game, true)}}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Score & Result -->
                    <div class="flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto gap-4 sm:gap-1 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 mt-1 sm:mt-0">
                        <div class="flex flex-col items-center sm:items-end">
                            <div :class="['text-sm font-bold uppercase tracking-wider mb-1', history.resultClass(game)]">
                                {{ history.resultLabel(game) }}
                            </div>
                            <div class="text-2xl font-black text-slate-800 leading-none">
                                {{ scoreLabel(game) }}
                            </div>
                        </div>

                        <RouterLink :to="{ name: 'MatchDetails', params: { id: game.id } }"
                            class="hidden sm:inline-flex items-center text-sm font-medium text-rose-600 hover:text-rose-800 hover:underline mt-2 gap-1"
                            aria-label="See game details">
                            Details <ArrowRight class="w-3.5 h-3.5" />
                        </RouterLink>
                    </div>

                    <!-- Mobile Button -->
                    <RouterLink :to="{ name: 'MatchDetails', params: { id: game.id } }"
                        class="sm:hidden w-full text-center py-2 rounded-lg bg-slate-50 text-slate-600 text-sm font-medium hover:bg-slate-100 mt-2">
                        Details
                    </RouterLink>
                </div>
            </li>
        </ul>

        <nav v-if="lastPage > 1" class="mt-8 flex flex-row gap-2 justify-center items-center"
            aria-label="Paginação de histórico">
            <button v-for="p in pages" :key="p" @click="loadPage(p, from, to)" :aria-current="p === page ? 'page' : null"
                :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all',
                    p === page
                        ? 'bg-rose-700 text-white shadow-md scale-105'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
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
import { Clock, Trophy, Gamepad2, ArrowRight } from 'lucide-vue-next';

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

async function loadPage(p = 1, from, to) {
    loading.value = true;
    error.value = null;
    try {
        const res = await dash.getGames({
            page: p,
            result: props.filterResult === 'all' ? null : props.filterResult,
            sortOrder: props.sortOrder,
            from: from,
            to: to,
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
