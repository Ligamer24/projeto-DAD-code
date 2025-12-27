<template>
    <adminBar />

    <div
        class="mt-5 max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">

        <div class="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <h1 class="text-2xl font-bold text-gray-800">System Matches</h1>
        </div>

        <div class="divide-y divide-gray-100">
            <div v-for="match in matches" :key="match.id"
                class="px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-all group">

                <div class="flex items-center gap-6 w-1/5">
                    <span
                        class="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-1 rounded border border-slate-800 uppercase">
                        #{{ match.id }}
                    </span>
                    <div>
                        <p class="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Status</p>
                        <span :class="[
                            'px-3 py-0.5 rounded text-[11px] font-black uppercase tracking-tight border',
                            match.status === 'Ended' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-amber-50 text-amber-600 border-amber-100'
                        ]">
                            {{ match.status }}
                        </span>
                    </div>
                </div>

                <div class="flex items-center justify-center gap-4 w-2/5">
                    <div class="text-right">
                        <p class="text-[10px] font-bold text-slate-400 uppercase">Player 1</p>
                        <p class="text-sm font-bold text-slate-700">
                            {{ match.player1?.nickname || 'N/A' }}
                            <span class="text-[10px] text-slate-400 font-mono">#{{ match.player1_user_id }}</span>
                        </p>
                        <p class="text-lg font-black text-slate-900 font-mono"><span
                                class="text-[10px] font-bold text-slate-400 uppercase">Marks: </span>{{
                                    match.player1_marks }}</p>
                    </div>

                    <div class="flex flex-col items-center px-4">
                        <span class="text-xs font-black text-slate-300 italic">VS</span>
                        <div v-if="match.status === 'playing'"
                            class="w-2 h-2 bg-emerald-500 rounded-full animate-ping mt-1"></div>
                    </div>

                    <div class="text-left">
                        <p class="text-[10px] font-bold text-slate-400 uppercase">Player 2</p>
                        <p class="text-sm font-bold text-slate-700">
                            {{ match.player2?.nickname || 'N/A' }}
                            <span class="text-[10px] text-slate-400 font-mono">#{{ match.player2_user_id }}</span>
                        </p>
                        <p class="text-lg font-black text-slate-900 font-mono"><span
                                class="text-[10px] font-bold text-slate-400 uppercase">Marks: </span>{{
                                    match.player2_marks }}</p>
                    </div>
                </div>
                <div
                    class="flex flex-col items-center justify-center bg-amber-50/50 border border-amber-100 px-4 py-2 rounded-2xl shadow-sm">
                    <span class="text-[9px] uppercase font-black text-amber-500 tracking-widest mb-1">Stake</span>
                    <div class="flex items-center gap-1.5">
                        <Coins class="size-5 lg:size-6 text-yellow-600" />

                        <span class="text-lg font-black text-amber-700 font-mono leading-none">
                            {{ match.stake }}
                        </span>
                    </div>
                </div>

                <div class="w-1/5 flex flex-col items-center">
                    <span class="text-[9px] uppercase font-black text-slate-400 mb-2 tracking-widest">Match
                        Winner</span>

                    <div v-if="match.winner_user_id" class="flex flex-col items-center">
                        <span class="text-emerald-600 font-black text-sm">
                            <span class="text-blue-400">
                                {{ match.winner_user_id === match.player1_user_id ? match.player1?.nickname :
                                    match.player2?.nickname }}
                            </span>
                            #{{ match.winner_user_id }}
                        </span>
                        <span
                            class="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold mt-1">WINNER</span>
                    </div>

                    <div v-else-if="match.status === 'playing'" class="text-amber-500 font-bold text-sm italic">
                        In Progress...
                    </div>
                    <div v-else-if="match.status === 'Interrupted'" class="text-amber-500 font-bold text-sm italic">
                        Interrupted...
                    </div>
                    <div v-else-if="match.status === 'Pending'" class="text-amber-500 font-bold text-sm italic">
                        Pending...
                    </div>

                    <div v-else class="text-slate-400 italic text-sm">
                        No winner
                    </div>
                </div>

                <div>
                    <router-link :to="`/admin/games/${match.id}`"
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
                        <span>{{ match.total_time }}s of match</span>
                    </div>
                    <div class="flex items-center gap-2 text-[11px] text-slate-500 font-medium mb-1">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Match Date</span>
                    </div>

                    <p class="text-[9px] text-slate-400 uppercase font-mono">
                        {{ new Date(match.began_at).toLocaleDateString() }} {{ new
                            Date(match.began_at).toLocaleTimeString() }}
                    </p>
                    <p class="text-[9px] text-slate-400 uppercase font-mono">
                        {{ new Date(match.ended_at).toLocaleDateString() }} {{ new
                            Date(match.ended_at).toLocaleTimeString() }}
                    </p>
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
                    class="px-5 py-2 text-xs font-black uppercase tracking-widest border-2 border-black bg-amber-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    Next
                </button>
            </div>
        </div>
    </div>
</template>


<script setup>
import AdminBar from '@/components/admin/adminBar.vue';
import { Coins } from "lucide-vue-next";

import { ref, onMounted } from 'vue';
import { useAPIStore } from '@/stores/api';
const api = useAPIStore();

const matches = ref([]);
const totalPages = ref(1);
const currentPage = ref(1);

const fetchMatches = async (page = 1) => {
    try {
        const response = await api.getMatchesAdmin(page);
        matches.value = response.data.data;
        currentPage.value = response.data.current_page;
        totalPages.value = response.data.last_page;
    } catch (error) {
        console.error('Error fetching matches:', error);
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

    fetchMatches(page);
};
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        fetchMatches(currentPage.value + 1)
    }
}
const prevPage = () => {
    if (currentPage.value > 1) {
        fetchMatches(currentPage.value - 1)
    }
}

onMounted(() => {
    fetchMatches();
});

</script>