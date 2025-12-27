<template>
    <adminBar />

    <div
        class="mt-5 max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div class="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <h1 class="text-2xl font-bold text-gray-800">System Games</h1>
        </div>

        <div class="divide-y divide-gray-100">
            <div v-for="game in games" :key="game.id"
                class="px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-all group">

                <div class="flex items-center gap-6 w-1/5">
                    <span
                        class="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded border border-slate-200 uppercase">
                        #{{ game.id }}
                    </span>
                    <div>
                        <p class="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Type</p>
                        <span :class="[
                            'px-3 py-0.5 rounded text-[11px] font-black uppercase tracking-tight border',
                            game.type === 3 ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                        ]">
                            Mode {{ game.type }}
                        </span>
                    </div>
                </div>

                <div class="flex items-center justify-center gap-4 w-2/5">
                    <div class="text-right">
                        <p class="text-[10px] font-bold text-slate-400 uppercase">Player 1</p>
                        <p class="text-sm font-bold text-slate-700">{{ game.player1?.nickname || 'N/A' }} (ID: {{
                            game.player1_user_id }})</p>
                        <p class="text-lg font-black text-slate-900 font-mono"><span
                                class="text-[10px] font-bold text-slate-400 uppercase">Points: </span>{{
                                    game.player1_points }}</p>
                    </div>

                    <div class="flex flex-col items-center px-4">
                        <span class="text-xs font-black text-slate-300 italic">VS</span>
                        <div v-if="game.is_draw"
                            class="mt-1 bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                            Draw</div>
                        <div v-else-if="game.status === 'Ended'"
                            class="mt-1 bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                            Finished</div>
                        <div v-else-if="game.status === 'Playing'"
                            class="mt-1 bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                            Playing</div>
                        <div v-else-if="game.status === 'Pending'"
                            class="mt-1 bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                            Pending</div>
                        <div v-else-if="game.status === 'Interrupted'"
                            class="mt-1 bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                            Interrupted</div>
                    </div>

                    <div class="text-left">
                        <p class="text-[10px] font-bold text-slate-400 uppercase">Player 2</p>
                        <p class="text-sm font-bold text-slate-700">{{ game.player2?.nickname || 'N/A' }} (ID: {{
                            game.player2_user_id }})</p>
                        <p class="text-lg font-black text-slate-900 font-mono"><span
                                class="text-[10px] font-bold text-slate-400 uppercase">Points: </span>{{
                                    game.player2_points }}</p>
                    </div>
                </div>

                <div class="w-1/5 flex flex-col items-center">
                    <span class="text-[9px] uppercase font-black text-slate-400 mb-2 tracking-widest">Result</span>
                    <div v-if="game.is_draw" class="text-amber-500 font-bold text-sm">Draw</div>
                    <div v-else-if="game.status === 'Pending'" class="text-slate-400 italic text-sm">Pending</div>
                    <div v-else-if="game.status === 'Interrupted'" class="text-slate-400 italic text-sm">Interrupted
                    </div>
                    <div v-else-if="game.status === 'Playing'" class="text-slate-400 italic text-sm">Playing</div>
                    <div v-else class="flex flex-col items-center">
                        <span class="text-[10px] text-slate-500">Winner:</span>
                        <div v-if="game.winner_user_id === game.player1_user_id">
                            <span class="text-emerald-600 font-black text-sm"><span class="text-blue-400">{{
                                game.player1?.nickname || 'N/A' }}</span> #{{
                                        game.player1_user_id }}</span>
                        </div>
                        <div v-else-if="game.winner_user_id === game.player2_user_id">
                            <span class="text-emerald-600 font-black text-sm"><span class="text-blue-400">{{
                                game.player2?.nickname || 'N/A' }}</span> #{{
                                        game.player2_user_id }}</span>
                        </div>
                        <div v-else class="text-slate-400 italic text-sm">
                            Nobody won
                        </div>
                    </div>
                    <span v-if="game.match_id"
                        class="mt-2 bg-blue-50 text-blue-500 text-[9px] px-2 py-1 rounded border border-blue-100 font-bold">
                        MATCH ID: {{ game.match_id }}
                    </span>
                </div>
                <div>
                    <router-link :to="`/MatchDetails/${game.id}`"
                        class="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl border border-indigo-100 transition-all duration-300 group">
                        View Details
                        <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </router-link>
                </div>

                <div class="w-1/5 flex flex-col items-end">
                    <div class="flex items-center gap-2 text-[11px] text-slate-500 font-medium mb-1">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{{ game.total_time }}s of game</span>
                    </div>
                    <p class="text-[9px] text-slate-400 uppercase">Start: {{ new Date(game.began_at).toLocaleString()
                    }}</p>
                    <p class="text-[9px] text-slate-400 uppercase">End: {{ game.ended_at ? new
                        Date(game.ended_at).toLocaleTimeString() : '---' }}</p>

                    <span :class="[
                        'mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border',
                        game.status === 'finished' ? 'bg-slate-800 text-white border-black' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    ]">
                        {{ game.status }}
                    </span>
                </div>

            </div>
        </div>

        <div class="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm font-medium text-gray-500">
                <span>Page</span>
                <input type="number" :value="currentPage" @keyup.enter="handlePageJump($event)"
                    class="w-12 h-8 text-center font-bold text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none [appearance:textfield]"
                    min="1" :max="totalPages">
                <span>of {{ totalPages }}</span>
            </div>

            <div class="flex items-center gap-3">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-5 py-2 text-xs font-black uppercase tracking-widest border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    Previous
                </button>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-5 py-2 text-xs font-black uppercase tracking-widest border-2 border-black bg-lime-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import AdminBar from '@/components/admin/adminBar.vue';
import { ref, onMounted } from 'vue';
import { useAPIStore } from '@/stores/api';
const api = useAPIStore();


const games = ref([]);
const currentPage = ref(1)
const totalPages = ref(1)

const fetchGames = async (page = 1) => {
    try {
        const response = await api.getGamesAdmin(page);
        games.value = response.data.data;
        totalPages.value = response.data.last_page;
        currentPage.value = response.data.current_page;
    } catch (error) {
        console.error('Error fetching games:', error);
    }
};

//Pagination function

const handlePageJump = (event) => {
    const page = parseInt(event.target.value);

    // Validação: Se não for número ou estiver fora do limite, volta para a página atual
    if (isNaN(page) || page < 1 || page > totalPages.value) {
        event.target.value = currentPage.value;
        return;
    }

    fetchGames(page);
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        fetchGames(currentPage.value + 1)
    }
}

const prevPage = () => {
    if (currentPage.value > 1) {
        fetchGames(currentPage.value - 1)
    }
}

onMounted(() => {
    fetchGames();
});


</script>