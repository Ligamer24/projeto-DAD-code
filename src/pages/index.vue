<script setup>
import {BarChart2, Gamepad2, RotateCcw, ShoppingCart} from 'lucide-vue-next'
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'
import History from "@/components/segments/dashboard/history.vue";
import Leaderboard from "@/components/segments/dashboard/leaderboard.vue";
import Dashboard from "@/components/segments/dashboard/dashboard.vue";
import Shop from "@/components/segments/dashboard/shop.vue";
import {useRoute, useRouter} from 'vue-router'
import {useAPIStore} from "@/stores/api";

const api = useAPIStore();

const currentPage = ref(1)
const pagesRef = ref(null)
const headerRef = ref(null)
const navRef = ref(null)
const isMobile = ref(true)
const scrollablePages = new Set([0, 2, 3])

const route = useRoute()
const router = useRouter()
const indexToRoute = ['shop', 'dashboard', 'leaderboard', 'history']
const routeToIndex = {shop: 0, dashboard: 1, leaderboard: 2, history: 3}

function updateIsMobile() {
  if (typeof window !== 'undefined') isMobile.value = window.innerWidth < 1024
}

function scrollToPage(idx) {
  const el = pagesRef.value
  if (!el) return
  const child = el.children?.[idx]
  const left = child ? child.offsetLeft : el.clientWidth * idx
  el.scrollTo({left, behavior: 'smooth'})
}

function updatePagesHeight() {
  if (typeof window === 'undefined') return
  const h = window.innerHeight
  const headerH = document.getElementsByTagName('header')[0]?.offsetHeight || 0
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
  window.addEventListener('resize', resizeHandler, {passive: true})

  // Initialize from current route BEFORE setting up observer
  let initialIdx = 1
  if (route.name && routeToIndex.hasOwnProperty(route.name)) {
    initialIdx = routeToIndex[route.name]
  }

  isManualScroll = true
  currentPage.value = initialIdx
  scrollToPage(initialIdx)
  if (manualScrollTimer) clearTimeout(manualScrollTimer)
  manualScrollTimer = setTimeout(() => {
    isManualScroll = false
  }, 600)

  // Now set up the observer for visible page
  const observerOptions = {root: pagesRef.value, threshold: [0.6]}
  io = new IntersectionObserver((entries) => {
    if (isManualScroll) return // ignore while manual scroll
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const parent = pagesRef.value
        const idx = Array.prototype.indexOf.call(parent.children, entry.target)
        if (idx !== -1 && idx !== currentPage.value) {
          currentPage.value = idx
          router.replace({name: indexToRoute[idx]})
        }
        break
      }
    }
  }, observerOptions)

  if (pagesRef.value)
    Array.from(pagesRef.value.children).forEach(child => io.observe(child))
})

onBeforeUnmount(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  if (io) io.disconnect()
  if (manualScrollTimer) clearTimeout(manualScrollTimer)
})

// When currentPage is changed programmatically, scroll to it
watch(currentPage, (v) => {
  if (isManualScroll) return
  scrollToPage(v)
})

// When route changes (via back/forward or external nav), update the page
watch(() => route.name, (name) => {
  if (!name || !routeToIndex.hasOwnProperty(name)) return
  const idx = routeToIndex[name]
  if (idx !== currentPage.value) {
    currentPage.value = idx
    scrollToPage(idx)
  }
})

function handleNavClick(idx) {
  if (idx === currentPage.value) return
  isManualScroll = true
  currentPage.value = idx
  if (manualScrollTimer) clearTimeout(manualScrollTimer)
  scrollToPage(idx)
  // also update the URL
  router.push({name: indexToRoute[idx]})
  manualScrollTimer = setTimeout(() => {
    isManualScroll = false
  }, 600)
}

const navItems = [
  {icon: ShoppingCart, label: 'Shop', idx: 0, aria: 'Store / Shop'},
  {icon: Gamepad2, label: 'Dashboard', idx: 1, aria: 'Dashboard'},
  {icon: BarChart2, label: 'Leaderboard', idx: 2, aria: 'Leaderboard'},
  {icon: RotateCcw, label: 'History', idx: 3, aria: 'Match History'},
]

function wrapperClass(idx) {
  const base = 'snap-start snap-always w-full shrink-0 min-w-full relative'
  const visibilityDesktop = currentPage.value === idx ? 'lg:block' : 'lg:hidden'
  const vertical = scrollablePages.has(idx) ? 'overflow-y-auto pb-24' : 'overflow-hidden'
  return [base, visibilityDesktop, vertical].join(' ')
}


defineProps({
  msg: String,
})

const swRegistration = ref(null)

onMounted(async () => {
  if ('serviceWorker' in navigator) {
    // Register the service worker and store the registration object so we can
    // use registration.showNotification(...) which provides better behavior
    // (and works when the page is not in focus).
    navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          swRegistration.value = reg
          console.log('Service Worker registered:', reg)
          // Avoid noisy alerts in normal use; log instead. If you want an alert,
          // uncomment the next line.
          // alert('Service Worker registered')
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err)
        })
  }


  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    alert('You will not receive notifications then.')
  }
})


const sendNotification = async () => {

  const title = 'Hello from PWA!'
  const options = {
    body: 'This is a test notification 🚀',
    // Use the 512 icon which exists in public/icons
    icon: '/icons/logo.png',
  }

  try {
    // Prefer showing the notification via the service worker registration
    // because it works even when the page isn't focused and better integrates
    // with the PWA lifecycle.
    if (swRegistration.value && typeof swRegistration.value.showNotification === 'function') {
      swRegistration.value.showNotification(title, options)
      return
    }

    // If we don't have the stored registration, try to get an active one.
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration()
      if (reg && typeof reg.showNotification === 'function') {
        reg.showNotification(title, options)
        return
      }

      // As a last resort, post a message to the active service worker which
      // will call showNotification from the SW (we added a message handler).
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({type: 'notify', title, options})
        return
      }
    }

    // Fallback to the page Notification API
    new Notification(title, options)
  } catch (err) {
    console.error('Error showing notification:', err)
  }
}

</script>

<template>
  <main class="relative mx-auto px-0 lg:px-4">
    <div
        ref="pagesRef"
        class="flex w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth lg:overflow-x-hidden no-scrollbar overscroll-x-contain"
    >
      <div :class="wrapperClass(0)">
        <shop/>
      </div>
      <div :class="wrapperClass(1)">
        <dashboard/>
      </div>
      <div :class="wrapperClass(2)">
        <leaderboard/>
      </div>
      <div :class="wrapperClass(3)">
        <history/>
      </div>
    </div>
  </main>

  <nav ref="navRef"
       class="fixed bottom-0 left-0 right-0 sm:px-8 bg-gradient-to-t from-black/10 to-transparent backdrop-blur-sm lg:static lg:bg-transparent lg:px-0">
    <div class="container mx-auto h-full">
      <div class="hidden lg:block h-px w-full bg-black/40"/>
      <div class="mx-auto max-w-xl flex items-center h-full justify-between text-black">
        <button
            v-for="item in navItems"
            :key="item.idx"
            :aria-label="item.aria"
            :aria-current="currentPage === item.idx ? 'page' : false"
            @click="handleNavClick(item.idx)"
            :class="['cursor-pointer grid place-items-center size-12 w-full h-full relative transition py-5', { 'bg-black/15': currentPage === item.idx }]"
        >
          <component :is="item.icon" class="size-6"/>
          <span v-if="currentPage === item.idx" class="h-1 w-6 rounded-full bg-black mt-2"/>
        </button>
      </div>
    </div>
  </nav>

  <button class="absolute top-0 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow"
          @click="api.subscribeToPushNotifications">
    Enable Notifications
  </button>
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
