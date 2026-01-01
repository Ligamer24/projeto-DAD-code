<template>
    <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-rose-200 border-t-rose-700"></div>
        <div class="mt-2 text-slate-500 text-sm">Loading history...</div>
    </div>

    <div v-else-if="error" class="text-center text-red-600 py-8 bg-red-50 rounded-lg border border-red-100">
        Error loading history: {{ error }}
    </div>

    <div v-else>
        <div v-if="filteredAndSorted.length === 0" class="text-center text-slate-500 py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            No matches found matching your criteria.
        </div>

        <ul v-else class="space-y-4">
            <li v-for="match in filteredAndSorted" :key="match.id"
                class="group bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200 hover:border-rose-200 hover:shadow-md transition-all duration-200">

                <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <!-- Date & Meta -->
                    <div class="flex flex-row sm:flex-col items-center sm:items-start justify-between w-full sm:w-auto sm:min-w-[100px] text-slate-500">
                        <div class="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {{ history.formatDate(match.began_at) }}
                        </div>
                        <div class="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 mt-0 sm:mt-1">
                            #{{ match.id }}
                        </div>
                    </div>

                    <!-- Match Info -->
                    <div class="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left w-full">
                        <div class="text-xs text-slate-400 font-medium mb-0.5">OPPONENT</div>
                        <div class="text-lg font-bold text-slate-800 group-hover:text-rose-700 transition-colors truncate w-full">
                            {{ history.opponentName(match) }}
                        </div>

                        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 mt-2 text-xs text-slate-500">
                            <div class="flex items-center gap-1.5" title="Game Type">
                                <Gamepad2 class="w-3.5 h-3.5 text-slate-400" />
                                <span class="font-medium">{{ match.type || 'Bisca' }}</span>
                            </div>
                            <div class="flex items-center gap-1.5" title="Duration">
                                <Clock class="w-3.5 h-3.5 text-slate-400" />
                                <span>{{ history.formatDuration(match) }}</span>
                            </div>
                            <div class="flex items-center gap-1.5" title="Stake">
                                <Coins class="w-3.5 h-3.5 text-slate-400" />
                                <span>{{ stakeLabel(match) }}</span>
                            </div>
                            <div class="flex items-center gap-1.5" title="Marks Earned">
                                <Trophy class="w-3.5 h-3.5 text-slate-400" />
                                <span>{{ history.myMarks(match) ?? 0 }} marks</span>
                            </div>
                        </div>
                    </div>

                    <!-- Score & Result -->
                    <div class="flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto gap-4 sm:gap-1 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 mt-1 sm:mt-0">
                        <div class="flex flex-col items-center sm:items-end">
                            <div :class="['text-sm font-bold uppercase tracking-wider mb-1', history.resultClass(match)]">
                                {{ history.resultLabel(match) }}
                            </div>
                            <div class="text-2xl font-black text-slate-800 leading-none">
                                {{ scoreLabel(match) }}
                            </div>
                        </div>

                        <RouterLink :to="{ name: 'GamesPage', params: { id: match.id } }"
                            class="hidden sm:inline-flex items-center text-sm font-medium text-rose-600 hover:text-rose-800 hover:underline mt-2 gap-1"
                            aria-label="See game details">
                            View Games <ArrowRight class="w-3.5 h-3.5" />
                        </RouterLink>
                    </div>

                    <!-- Mobile Button -->
                    <RouterLink :to="{ name: 'GamesPage', params: { id: match.id } }"
                        class="sm:hidden w-full text-center py-2 rounded-lg bg-slate-50 text-slate-600 text-sm font-medium hover:bg-slate-100 mt-2">
                        View Games
                    </RouterLink>
                </div>
            </li>
        </ul>

        <nav v-if="lastPage > 1" class="mt-8 flex flex-row gap-2 justify-center items-center"
            aria-label="Paginação de histórico">
            <button v-for="p in pages" :key="p" @click="loadPage(p, from, to)"
                :aria-current="p === page ? 'page' : null" :class="[
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
    name: 'MatchList',
};
</script>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useDashStore } from '@/stores/dash';
import { RouterLink } from 'vue-router';
import { useHistoryStore } from '@/stores/historyStore';
import { Clock, Coins, Trophy, Gamepad2, ArrowRight } from 'lucide-vue-next';

const auth = useAuthStore();
const dash = useDashStore();
const history = useHistoryStore();

const loading = ref(false);
const error = ref(null);
const matches = ref([]);

const page = ref(1);
const lastPage = ref(1);

const props = defineProps({
    filterResult: { type: String, default: 'all' },
    sortOrder: { type: String, default: 'desc' },
    from: { type: String, default: null },
    to: { type: String, default: null },
});




async function loadPage(p, from, to) {

    loading.value = true;
    error.value = null;
    try {
        const res = await dash.getMatches({
            page: p,
            result: props.filterResult,
            sortOrder: props.sortOrder,
            from: from,
            to: to,

        });

        const payload = res.data || res;
        matches.value = payload.data || [];
        page.value = payload.current_page || p;
        lastPage.value = payload.last_page || 1;
    } catch (e) {
        error.value = e?.message || String(e);
    } finally {
        loading.value = false;
    }
}

const filteredMatches = computed(() => {
    if (!props.filterResult || props.filterResult === 'all') return matches.value;
    return matches.value.filter((match) => {
        const meId = auth.currentUser?.id;
        const result = match.is_draw
            ? 'draw'
            : match.winner_user_id === meId
                ? 'victory'
                : 'defeat';
        return result === props.filterResult;
    });
});

const filteredAndSorted = computed(() => {
    const filtered = filteredMatches.value;
    return [...filtered].sort((a, b) => {
        const dateA = new Date(a.began_at).getTime();
        const dateB = new Date(b.began_at).getTime();
        return props.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
});

onMounted(() => loadPage(1));

watch(() => [props.sortOrder, props.filterResult], () => {
    page.value = 1;
    loadPage(1);
});

const pages = computed(() =>
    Array.from({ length: Math.max(0, Number(lastPage.value) || 0) }, (_, i) => i + 1)
);

function stakeLabel(match) {
    if (!match || match.stake == null) return '—';
    return `${match.stake}`;
}

function scoreLabel(match) {
    if (!match) return '—';
    const p1Points = match.player1_points != null ? match.player1_points : '-';
    const p2Points = match.player2_points != null ? match.player2_points : '-';
    return `${p1Points} : ${p2Points}`;
}

defineExpose({ loadPage });
</script>
