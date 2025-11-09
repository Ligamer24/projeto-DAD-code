<script setup>
import {ShoppingCart, Gamepad2, BarChart2, RotateCcw, Coins, UserRound} from 'lucide-vue-next'
import {onMounted, onBeforeUnmount, ref} from 'vue'
import History from "@/components/segments/dashboard/history.vue";
import Leaderboard from "@/components/segments/dashboard/leaderboard.vue";
import Dashboard from "@/components/segments/dashboard/dashboard.vue";
import Shop from "@/components/segments/dashboard/shop.vue";

const currentPage = ref(1) // default to dashboard (index 1) per requirement order
const pagesRef = ref(null)

// Mobile / desktop detection (avoid template window access)
const isMobile = ref(true)

function updateIsMobile() {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 1024 // Tailwind lg breakpoint
  }
}

// Replace scrollToPage to only act on mobile
function scrollToPage(idx) {
  const el = pagesRef.value
  const child = el?.children?.[idx]
  const left = child ? child.offsetLeft : (el ? el.clientWidth * idx : 0)
  if (el) el.scrollTo({ left, behavior: 'smooth' })
}

// Throttled scroll handler (mobile only)
let ticking = false

function handleScroll() {
  if (!isMobile.value) return
  const el = pagesRef.value
  if (!el) return
  if (!ticking) {
    ticking = true
    requestAnimationFrame(() => {
      const width = el.clientWidth || 1
      const idx = Math.round(el.scrollLeft / width)
      if (idx !== currentPage.value) currentPage.value = idx
      ticking = false
    })
  }
}

onMounted(() => {
  updateIsMobile()
  if (typeof window !== 'undefined') window.addEventListener('resize', updateIsMobile, { passive: true })
  const el = pagesRef.value
  if (el) el.addEventListener('scroll', handleScroll, { passive: true })
  // position at the initial page
  scrollToPage(currentPage.value)
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('resize', updateIsMobile)
  const el = pagesRef.value
  if (el) el.removeEventListener('scroll', handleScroll)
})

const navItems = [
  {icon: ShoppingCart, label: 'Shop', idx: 0, aria: 'Store / Shop'},
  {icon: Gamepad2, label: 'Dashboard', idx: 1, aria: 'Dashboard'},
  {icon: BarChart2, label: 'Leaderboard', idx: 2, aria: 'Leaderboard'},
  {icon: RotateCcw, label: 'History', idx: 3, aria: 'Match History'},
]
</script>

<template>
  <!-- Responsive website container: mobile-first full-screen gradient; desktop two-column -->
  <div class="min-h-svh w-full bg-gradient-to-b from-lime-300 to-yellow-300">
    <!-- Header -->
    <header class="container mx-auto px-4 pt-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="size-9 rounded-full bg-white/80 border border-black/40 grid place-items-center">
            <UserRound class="size-5 text-emerald-700"/>
          </div>
          <span class="text-lg lg:text-xl font-semibold text-black">Ana</span>
        </div>
        <div class="flex items-center gap-1 text-black">
          <span class="text-lg lg:text-xl font-bold">300</span>
          <Coins class="size-5 lg:size-6 text-yellow-600"/>
        </div>
      </div>
      <div class="mt-2 h-px w-full bg-black/40"/>
    </header>

    <!-- Main content: horizontal scroll pages on mobile; single displayed page on desktop -->
    <main class="relative mx-auto px-0 lg:px-4 pb-24 lg:pb-10 max-w-7xl">
      <!-- Mobile horizontal scroll wrapper -->
      <div
          ref="pagesRef"
          class="flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth lg:overflow-x-hidden no-scrollbar"
      >

        <!-- Shop Page (index 0) -->
        <shop :class="currentPage !== 0 ? 'lg:hidden' : 'lg:block'"/>

        <!-- Dashboard Page (index 1) -->
        <dashboard :class="currentPage !== 1 ? 'lg:hidden' : 'lg:block'"/>

        <!-- Leaderboard Page (index 2) -->
        <leaderboard :class="currentPage !== 2 ? 'lg:hidden' : 'lg:block'"/>

        <!-- Match History Page (index 3) -->
        <history :class="currentPage !== 3 ? 'lg:hidden' : 'lg:block'"/>
      </div>
    </main>

    <!-- Bottom nav: fixed on mobile, in-flow on desktop -->
    <nav
        class="fixed bottom-0 left-0 right-0 px-6 sm:px-8 pb-5 pt-2 bg-gradient-to-t from-black/10 to-transparent backdrop-blur-sm lg:static lg:bg-transparent lg:px-0">
      <div class="container mx-auto">
        <div class="hidden lg:block h-px w-full bg-black/40 mb-3"/>
        <div class="mx-auto max-w-xl flex items-center justify-between text-black">
          <button
              v-for="item in navItems"
              :key="item.idx"
              :aria-label="item.aria"
              :aria-current="currentPage === item.idx ? 'page' : false"
              @click="scrollToPage(item.idx)"
              class="grid place-items-center size-12 rounded-full bg-black/5 hover:bg-black/10 transition relative"
          >
            <component :is="item.icon" class="size-6"/>
            <span
                v-if="currentPage === item.idx"
                class="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-black"
            />
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
