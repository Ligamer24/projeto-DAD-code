<template>
    <div
        class="mt-5 max-w-7xl mx-auto bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden px-6 py-4 flex items-center justify-start gap-6">
<RouterLink to="/admin/users" v-slot="{ href, isActive, navigate }">
  <a :href="href" @click="navigate"
     :class="['text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all', isActive ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700']">
    Users
  </a>
</RouterLink>
<RouterLink to="/admin/transactions" v-slot="{ href, isActive, navigate }">
  <a :href="href" @click="navigate"
     :class="['text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all', isActive ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700']">
    See all transactions
  </a>
</RouterLink>
<RouterLink to="/admin/games" v-slot="{ href, isActive, navigate }">
  <a :href="href" @click="navigate"
     :class="['text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all', isActive ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700']">
    See all games
  </a>
</RouterLink>
<RouterLink to="/admin/matches" v-slot="{ href, isActive, navigate }">
  <a :href="href" @click="navigate"
     :class="['text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all', isActive ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700']">
    See all matches
  </a>
</RouterLink>
    </div>
</template>