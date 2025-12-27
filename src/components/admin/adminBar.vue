<template>
    <div
        class="mt-5 max-w-7xl mx-auto bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden px-6 py-4 flex items-center justify-start gap-6">
        <RouterLink to="/dashboard"
            class="bg-gray-400 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all">
            Return to Dashboard

        </RouterLink>
        <RouterLink to="/transactionsPage"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all">
            See all transactions

        </RouterLink>
        <RouterLink to="/gamesPage"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all">
            See all games
        </RouterLink>
        <RouterLink to="/matchesPage"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all">
            See all matches
        </RouterLink>
    </div>
</template>