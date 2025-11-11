<script setup>
import { ShoppingCart, Gamepad2, BarChart2, RotateCcw, Coins, UserRound } from 'lucide-vue-next'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import History from "@/components/segments/dashboard/history.vue";
import Leaderboard from "@/components/segments/dashboard/leaderboard.vue";
import Dashboard from "@/components/segments/dashboard/dashboard.vue";
import Shop from "@/components/segments/dashboard/shop.vue";
import Navbar from "@/components/navbar.vue";

const currentPage = ref(1)
const pagesRef = ref(null)
const headerRef = ref(null)
const navRef = ref(null)
const isMobile = ref(true)
const scrollablePages = new Set([0, 2, 3])

function updateIsMobile() {
  if (typeof window !== 'undefined') isMobile.value = window.innerWidth < 1024
}

function scrollToPage(idx) {
  const el = pagesRef.value
  if (!el) return
  const child = el.children?.[idx]
  const left = child ? child.offsetLeft : el.clientWidth * idx
  el.scrollTo({ left, behavior: 'smooth' })
}

function updatePagesHeight() {
  if (typeof window === 'undefined') return
  const h = window.innerHeight
  const headerH = headerRef.value?.offsetHeight || 0
  const navH = navRef.value?.offsetHeight || 0
  const available = Math.max(0, h - headerH - navH)
  if (pagesRef.value) {
    pagesRef.value.style.height = available + 'px'
    Array.from(pagesRef.value.children).forEach((c, i) => {
      c.style.height = available + 'px'
      c.style.overflowY = scrollablePages.has(i) ? 'auto' : 'hidden'
      c.style.paddingBottom = scrollablePages.has(i) ? '6rem' : '0'
    })
  }
}

let resizeHandler = null
let io = null
let isManualScroll = false
let manualScrollTimer = null

onMounted(() => {
  updateIsMobile()
  updatePagesHeight()

  resizeHandler = () => requestAnimationFrame(() => {
    updateIsMobile()
    updatePagesHeight()
  })
  window.addEventListener('resize', resizeHandler, { passive: true })

  // Observer for visible page
  const observerOptions = { root: pagesRef.value, threshold: [0.6] }
  io = new IntersectionObserver((entries) => {
    if (isManualScroll) return // ignore while manual scroll
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const parent = pagesRef.value
        const idx = Array.prototype.indexOf.call(parent.children, entry.target)
        if (idx !== -1 && idx !== currentPage.value) currentPage.value = idx
        break
      }
    }
  }, observerOptions)

  if (pagesRef.value)
    Array.from(pagesRef.value.children).forEach(child => io.observe(child))

  scrollToPage(currentPage.value)
})

onBeforeUnmount(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  if (io) io.disconnect()
  if (manualScrollTimer) clearTimeout(manualScrollTimer)
})

// Watcher → scroll only on programmatic currentPage changes (not manual click flow)
watch(currentPage, (v, oldV) => {
  if (isManualScroll) return // already scrolling by click
  scrollToPage(v)
})

function handleNavClick(idx) {
  if (idx === currentPage.value) return
  // mark manual scroll mode so the observer doesn't override while animating
  isManualScroll = true
  // immediately set currentPage so the bottom bar highlights right away
  currentPage.value = idx
  if (manualScrollTimer) clearTimeout(manualScrollTimer)
  // perform smooth scroll
  scrollToPage(idx)
  // re-enable observer after the scroll animation finishes
  manualScrollTimer = setTimeout(() => { isManualScroll = false }, 600)
}

const navItems = [
  { icon: ShoppingCart, label: 'Shop', idx: 0, aria: 'Store / Shop' },
  { icon: Gamepad2, label: 'Dashboard', idx: 1, aria: 'Dashboard' },
  { icon: BarChart2, label: 'Leaderboard', idx: 2, aria: 'Leaderboard' },
  { icon: RotateCcw, label: 'History', idx: 3, aria: 'Match History' },
]

function wrapperClass(idx) {
  const base = 'snap-start snap-always w-full shrink-0 min-w-full relative'
  const visibilityDesktop = currentPage.value === idx ? 'lg:block' : 'lg:hidden'
  const vertical = scrollablePages.has(idx) ? 'overflow-y-auto pb-24' : 'overflow-hidden'
  return [base, visibilityDesktop, vertical].join(' ')
}
</script>

<template>
  <div class="min-h-svh w-full bg-gradient-to-b from-lime-300 to-yellow-300">
   <navbar/>

    <main class="relative mx-auto px-0 lg:px-4">
      <div
          ref="pagesRef"
          class="flex w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth lg:overflow-x-hidden no-scrollbar overscroll-x-contain"
      >
        <div :class="wrapperClass(0)"><shop /></div>
        <div :class="wrapperClass(1)"><dashboard /></div>
        <div :class="wrapperClass(2)"><leaderboard /></div>
        <div :class="wrapperClass(3)"><history /></div>
      </div>
    </main>

    <nav ref="navRef" class="fixed bottom-0 left-0 right-0 sm:px-8 pt-2 bg-gradient-to-t from-black/10 to-transparent backdrop-blur-sm lg:static lg:bg-transparent lg:px-0">
      <div class="container mx-auto h-full">
        <div class="hidden lg:block h-px w-full bg-black/40 mb-3"/>
        <div class="mx-auto max-w-xl flex items-center h-full justify-between text-black">
          <button
              v-for="item in navItems"
              :key="item.idx"
              :aria-label="item.aria"
              :aria-current="currentPage === item.idx ? 'page' : false"
              @click="handleNavClick(item.idx)"
              :class="['grid place-items-center size-12 w-full h-full relative transition py-5', { 'bg-black/15': currentPage === item.idx }]"
          >
            <component :is="item.icon" class="size-6" />
            <span v-if="currentPage === item.idx" class="h-1 w-6 rounded-full bg-black mt-2" />
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
