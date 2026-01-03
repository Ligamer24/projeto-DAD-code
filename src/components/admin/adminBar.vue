<script setup>
const navLinks = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'Users', path: '/admin/users' },
  { name: 'Transactions', path: '/admin/transactions' },
  { name: 'Games', path: '/admin/games' },
  { name: 'Matches', path: '/admin/matches' },
];
</script>

<template>
  <div class="w-full px-4 pt-8">
    <nav class="max-w-fit mx-auto bg-white/80 backdrop-blur-md border border-gray-200/50 p-1.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-1.5">
      <RouterLink
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        custom
        v-slot="{ href, isActive, navigate }"
      >
        <a
          :href="href"
          @click="navigate"
          :class="[
            'px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ease-in-out',
            isActive
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          ]"
        >
          {{ link.name }}
        </a>
      </RouterLink>
    </nav>
  </div>
</template>