<script setup>
import {ShoppingCart, Gamepad2, BarChart2, RotateCcw, Coins, UserRound} from 'lucide-vue-next'
import {onMounted, onBeforeUnmount, ref} from 'vue'
import History from "@/components/segments/dashboard/history.vue";
import Leaderboard from "@/components/segments/dashboard/leaderboard.vue";
import Dashboard from "@/components/segments/dashboard/dashboard.vue";
import Shop from "@/components/segments/dashboard/shop.vue";

const currentPage = ref(1) // default dashboard index
const pagesRef = ref(null)
const headerRef = ref(null)
const navRef = ref(null)

// Mobile / desktop detection
const isMobile = ref(true)
function updateIsMobile() {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 1024
  }
}

// Pages that should have independent vertical scroll
const scrollablePages = new Set([0, 2, 3]) // shop, leaderboard, history

function scrollToPage(idx) {
  const el = pagesRef.value
  // Always update the reactive page index so desktop toggles visibility immediately
  const child = el?.children?.[idx]
  const left = child ? child.offsetLeft : (el ? el.clientWidth * idx : 0)
  if (el && isMobile.value) el.scrollTo({ left, behavior: 'smooth' })
}

// Keep horizontal scroll -> currentPage in sync
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

// Dynamically set height for page wrappers so vertical scroll works independently
function updatePagesHeight() {
  if (typeof window === 'undefined') return
  const h = window.innerHeight
  const headerH = headerRef.value?.offsetHeight || 0
  const navH = navRef.value?.offsetHeight || 0
  const available = h - headerH - navH
  if (available > 0 && pagesRef.value) {
    pagesRef.value.style.height = available + 'px'
    // also apply height to each child wrapper
    Array.from(pagesRef.value.children).forEach(c => {
      c.style.height = available + 'px'
    })
  }
}

let resizeHandler
onMounted(() => {
  updateIsMobile()
  updatePagesHeight()
  if (typeof window !== 'undefined') {
    resizeHandler = () => {
      updateIsMobile()
      updatePagesHeight()
    }
    window.addEventListener('resize', resizeHandler, { passive: true })
  }
  const el = pagesRef.value
  if (el) el.addEventListener('scroll', handleScroll, { passive: true })
  scrollToPage(currentPage.value)
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined' && resizeHandler) window.removeEventListener('resize', resizeHandler)
  const el = pagesRef.value
  if (el) el.removeEventListener('scroll', handleScroll)
})

const navItems = [
  {icon: ShoppingCart, label: 'Shop', idx: 0, aria: 'Store / Shop'},
  {icon: Gamepad2, label: 'Dashboard', idx: 1, aria: 'Dashboard'},
  {icon: BarChart2, label: 'Leaderboard', idx: 2, aria: 'Leaderboard'},
  {icon: RotateCcw, label: 'History', idx: 3, aria: 'Match History'},
]

function wrapperClass(idx) {
  const base = 'snap-start w-full shrink-0 min-w-full relative'
  const visibilityDesktop = currentPage.value === idx ? 'lg:block' : 'lg:hidden'
  const vertical = scrollablePages.has(idx) ? 'overflow-y-auto pb-24' : 'overflow-hidden'
  return [base, visibilityDesktop, vertical].join(' ')
}
</script>

<template>
  <!-- App container -->
  <div class="min-h-svh w-full bg-gradient-to-b from-lime-300 to-yellow-300">
    <!-- Header -->
    <header ref="headerRef" class="container mx-auto px-4 pt-5">
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

    <!-- Horizontal pages container -->
    <main class="relative mx-auto px-0 lg:px-4 lg:pb-10 max-w-7xl">
      <div
        ref="pagesRef"
        class="flex w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth lg:overflow-x-hidden no-scrollbar"
      >
        <!-- Shop Page (index 0) -->
        <div :class="wrapperClass(0)">
          <shop />
        </div>
        <!-- Dashboard Page (index 1) -->
        <div :class="wrapperClass(1)">
          <dashboard />
        </div>
        <!-- Leaderboard Page (index 2) -->
        <div :class="wrapperClass(2)">
          <leaderboard />
        </div>
        <!-- Match History Page (index 3) -->
        <div :class="wrapperClass(3)">
          <history />
        </div>
      </div>
    </main>

    <!-- Bottom navigation -->
    <nav ref="navRef" class="fixed bottom-0 left-0 right-0 px-6 sm:px-8 pb-5 pt-2 bg-gradient-to-t from-black/10 to-transparent backdrop-blur-sm lg:static lg:bg-transparent lg:px-0">
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
            <component :is="item.icon" class="size-6" />
            <span v-if="currentPage === item.idx" class="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-black" />
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
