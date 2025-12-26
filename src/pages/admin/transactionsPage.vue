<template>
    <adminBar />

    <div
        class="mt-5 max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div class="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <h1 class="text-2xl font-bold text-gray-800">System transactions</h1>
        </div>
        <div class="divide-y divide-gray-100">
            <div v-for="transaction in transactions" :key="transaction.id"
                class="px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-all group">

                <div class="flex items-center gap-6 w-1/4">
                    <span
                        class="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded border border-slate-200 uppercase">
                        {{ transaction.id }}
                    </span>
                    <div>
                        <p class="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Amount</p>
                        <p class="text-xl font-black text-slate-900 font-mono tracking-tight">
                            {{ transaction.coins > 0 ? '+' : '' }}{{ transaction.coins }}
                            <span class="text-xs font-medium text-slate-400 uppercase">coins</span>
                        </p>
                    </div>
                </div>

                <div class="flex flex-col gap-1.5 w-1/4">
                    <div class="flex items-center gap-2 text-slate-600">
                        <svg class="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span class="text-sm font-semibold">{{ transaction.user.nickname }} #{{ transaction.user_id
                        }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{{ transaction.transaction_datetime ? new
                            Date(transaction.transaction_datetime).toLocaleString() : 'No date' }}</span>
                    </div>
                </div>

                <div class="flex items-center gap-3 w-1/4 justify-center">
                    <div v-if="transaction.game_id" class="flex flex-col items-center">
                        <span class="text-[9px] uppercase font-black text-blue-400 mb-1">Game</span>
                        <span
                            class="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100">
                            ID: {{ transaction.game_id }}
                        </span>
                    </div>
                    <div v-if="transaction.match_id" class="flex flex-col items-center">
                        <span class="text-[9px] uppercase font-black text-purple-400 mb-1">Match</span>
                        <span
                            class="bg-purple-50 text-purple-700 text-[10px] font-bold px-3 py-1 rounded-full border border-purple-100">
                            ID: {{ transaction.match_id }}
                        </span>
                    </div>
                    <div v-if="!transaction.game_id && !transaction.match_id" class="text-slate-300 italic text-xs">
                        No Game/Match attached
                    </div>
                </div>

                <div class="w-1/4 flex flex-col items-end">
                    <span class="text-[9px] uppercase font-black text-slate-400 mb-2 tracking-widest">Transaction
                        Type</span>
                    <span :class="[
                        'px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-colors',
                        transaction.coin_transaction_type_id in [1, 2, 5, 6]
                            ? 'bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-600 group-hover:text-white'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white'
                    ]">
                        {{ transaction.coin_transaction_type_id }}
                    </span>
                </div>

            </div>
        </div>
        <div class="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm font-medium text-gray-500">
                <span>Page</span>
                <input type="number" :value="currentPage" @keyup.enter="handlePageJump($event)"
                    @blur="handlePageJump($event)"
                    class="w-12 h-8 text-center font-bold text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="1" :max="totalPages">
                <span>of {{ totalPages }}</span>
            </div>

            <div class="flex items-center gap-3">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-5 py-2 text-xs font-black uppercase tracking-widest border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0">
                    Previous
                </button>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-5 py-2 text-xs font-black uppercase tracking-widest border-2 border-black bg-lime-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0">
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


const transactions = ref([]);
const totalPages = ref(1);
const currentPage = ref(1);

const fetchTransactions = async (page = 1) => {
    try {
        const response = await api.getTransactionsAdmin(page);
        transactions.value = response.data.data;
        currentPage.value = response.data.current_page;
        totalPages.value = response.data.last_page;
    } catch (error) {
        console.error('Error fetching transactions:', error);
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

    fetchTransactions(page);
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        fetchTransactions(currentPage.value + 1)
    }
}

const prevPage = () => {
    if (currentPage.value > 1) {
        fetchTransactions(currentPage.value - 1)
    }
}

onMounted(() => {
    fetchTransactions();
});

</script>
