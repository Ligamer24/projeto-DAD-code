<template>
    <div v-if="loading" class="text-center py-8">
        Loading history...
    </div>

    <div v-else-if="error" class="text-center text-red-600 py-4">
        Error loading history: {{ error }}
    </div>

    <div v-else>
        <div v-if="filteredAndSorted.length === 0" class="text-center text-slate-600 py-6">
            No matches found.
        </div>

        <ul v-else class="space-y-3">
            <li v-for="match in filteredAndSorted" :key="match.id"
                class="flex flex-col sm:flex-row sm:items-center justify-between bg-white/60 p-3 rounded shadow-sm w-full">
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 w-full sm:w-auto">
                    <div class="min-w-0 flex-1">
                        <div class="font-medium truncate">vs {{ history.opponentName(match) }}</div>
                        <div class="text-xs text-slate-500 truncate">
                            {{ history.formatDate(match.began_at) }} • {{ history.formatDuration(match) }}
                        </div>
                    </div>

                    <div
                        class="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto text-center sm:text-left">
                        <span v-if="match.id"
                            class="text-xs text-slate-500 px-2 py-0.5 rounded border border-slate-100 font-mono">
                            #{{ match.id }}
                        </span>

                        <span class="text-xs text-slate-500 px-2 py-0.5 bg-white/40 rounded border border-slate-100">
                            Coins earned: {{ stakeLabel(match) }}
                        </span>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                    <div class="text-center sm:text-right flex-1 sm:flex-none">
                        <div :class="history.resultClass(match)">{{ history.resultLabel(match) }}</div>
                        <div class="text-md text-slate-900 font-semibold mb-2">{{ scoreLabel(match) }}</div>

                        <RouterLink :to="{ name: 'GamesPage', params: { id: match.id } }"
                            class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-white bg-rose-700 hover:bg-rose-800 w-full sm:w-auto justify-center"
                            aria-label="See game details">
                            See games
                        </RouterLink>
                    </div>
                </div>
            </li>
        </ul>

        <nav v-if="lastPage > 1" class="mt-4 flex flex-row gap-2 justify-center items-center"
            aria-label="Paginação de histórico">
            <button v-for="p in pages" :key="p" @click="loadPage(p, from, to)"
                :aria-current="p === page ? 'page' : null" :class="[
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
    name: 'MatchList',
};
</script>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useDashStore } from '@/stores/dash';
import { RouterLink } from 'vue-router';
import { useHistoryStore } from '@/stores/historyStore';

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

watch(() => props.sortOrder, () => {
    page.value = 1;
    loadPage(1);
});



const pages = computed(() =>
    Array.from({ length: Math.max(0, Number(lastPage.value) || 0) }, (_, i) => i + 1)
);

function stakeLabel(match) {
    if (!match || match.stake == null) return '—';
    return `${match.stake} coins`;
}

function scoreLabel(match) {
    if (!match) return '—';
    const p1Points = match.player1_points != null ? match.player1_points : '-';
    const p2Points = match.player2_points != null ? match.player2_points : '-';
    return `${p1Points} : ${p2Points}`;
}

defineExpose({ loadPage });
</script>
