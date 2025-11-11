<script setup>
import {useRouter} from 'vue-router'
import Navbar from '@/components/navbar.vue'
import {ArrowLeft, Coins, Crown, Star, Upload, UserRound} from 'lucide-vue-next'
import {useUserStore} from '@/stores/user.js'
import {storeToRefs} from 'pinia'
import {ref} from 'vue'

const router = useRouter()
const user = useUserStore()
const {name, nickname, email, coins, rating, rank, shortDate, avatarUrl} = storeToRefs(user)

const currentPwd = ref('')
const newPwd = ref('')
const confirmPwd = ref('')
const pwdErrors = ref([])
const pwdSuccess = ref(false)

function goBack() {
  router.push({name: 'home'})
}

function onAvatarChange(e) {
  const file = e.target.files?.[0]
  user.updateAvatar(file)
}

function onSubmitProfile(e) {
  e.preventDefault()
  user.updateProfile({name: name.value, nickname: nickname.value, email: email.value})
}

function onSubmitPassword(e) {
  e.preventDefault()
  const res = user.changePassword({current: currentPwd.value, next: newPwd.value, confirm: confirmPwd.value})
  pwdSuccess.value = !!res.ok
  pwdErrors.value = res.ok ? [] : res.errors
  if (res.ok) {
    currentPwd.value = ''
    newPwd.value = ''
    confirmPwd.value = ''
  }
}
</script>

<template>
  <div class="min-h-svh w-full bg-lime-300">
    <Navbar/>

    <main class="container mx-auto px-4 pt-4 text-black pb-12">
      <button
          aria-label="Back to Home"
          class="inline-flex cursor-pointer items-center gap-2 text-black/80 hover:text-black transition mb-4"
          @click="goBack"
      >
        <ArrowLeft class="size-5"/>
        <span>Back</span>
      </button>

      <div class="grid lg:grid-cols-3 gap-4">
        <!-- Profile summary card -->
        <section class="lg:col-span-1 bg-white/70 border border-black/30 rounded-xl p-4 md:p-6">
          <div class="flex flex-col items-center text-center">
            <div
                class="size-24 rounded-full bg-emerald-100 border border-black/30 grid place-items-center overflow-hidden">
              <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="size-full object-cover"/>
              <UserRound v-else class="size-12 text-emerald-700"/>
            </div>
            <h1 class="mt-3 text-2xl font-bold">{{ name }}</h1>
            <p class="text-black/70">@{{ nickname }}</p>

            <div class="mt-4 grid grid-cols-3 gap-2 w-full mb-2">
              <div>
                <div class="text-xs uppercase tracking-wide text-black/60">Coins</div>
                <div class="flex items-center gap-1 text-lg font-semibold">
                  <Coins class="size-4 text-yellow-600"/>
                  {{ coins }}
                </div>
              </div>
              <div>
                <div class="text-xs uppercase tracking-wide text-black/60">Rating</div>
                <div class="flex items-center gap-1 text-lg font-semibold">
                  <Star class="size-4 text-emerald-700"/>
                  {{ rating }}
                </div>
              </div>
              <div>
                <div class="text-xs uppercase tracking-wide text-black/60">Rank</div>
                <div class="flex items-center gap-1 text-lg font-semibold">
                  <Crown class="size-4 text-amber-700"/>
                  {{ rank }}
                </div>
              </div>
            </div>

            <div class="mt-4 text-sm text-black/70">Member since {{ shortDate }}</div>
          </div>
        </section>

        <!-- Forms -->
        <section class="lg:col-span-2 grid gap-4">
          <!-- Profile info form -->
          <form class="bg-white/70 border border-black/30 rounded-xl p-4 md:p-6" @submit="onSubmitProfile">
            <h2 class="text-xl font-semibold mb-4">Profile</h2>

            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1" for="name">Name</label>
                <input id="name" v-model="name" class="w-full rounded-md border border-black/30 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                       type="text"/>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1" for="nickname">Nickname</label>
                <input id="nickname" v-model="nickname" class="w-full rounded-md border border-black/30 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                       type="text"/>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium mb-1" for="email">Email</label>
                <input id="email" v-model="email" class="w-full rounded-md border border-black/30 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                       type="email"/>
              </div>

              <div class="sm:col-span-2">
                <label class="block text-sm font-medium mb-1">Profile image</label>
                <div class="flex items-center gap-3">
                  <input id="avatar" accept="image/*" class="block w-full text-sm text-black file:mr-3 file:rounded-md file:border file:border-black/30 file:bg-black/5 file:px-3 file:py-1.5 file:text-black hover:file:bg-black/10" type="file"
                         @change="onAvatarChange"/>
                  <Upload class="size-5 text-black/70"/>
                </div>
              </div>
            </div>

            <div class="mt-4 flex justify-end">
              <button class="cursor-pointer px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800"
                      type="submit">
                Save changes
              </button>
            </div>
          </form>

          <!-- Change password form -->
          <form class="bg-white/70 border border-black/30 rounded-xl p-4 md:p-6" @submit="onSubmitPassword">
            <h2 class="text-xl font-semibold mb-4">Change password</h2>

            <div class="grid sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium mb-1" for="current">Current password</label>
                <input id="current" v-model="currentPwd" class="w-full rounded-md border border-black/30 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                       type="password"/>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1" for="new">New password</label>
                <input id="new" v-model="newPwd" class="w-full rounded-md border border-black/30 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                       type="password"/>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1" for="confirm">Confirm new password</label>
                <input id="confirm" v-model="confirmPwd" class="w-full rounded-md border border-black/30 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                       type="password"/>
              </div>
            </div>

            <div v-if="pwdErrors.length"
                 class="mt-3 rounded-md border border-red-300 bg-red-50 text-red-700 p-3 text-sm">
              <ul class="list-disc pl-5">
                <li v-for="e in pwdErrors" :key="e">{{ e }}</li>
              </ul>
            </div>
            <div v-if="pwdSuccess"
                 class="mt-3 rounded-md border border-emerald-300 bg-emerald-50 text-emerald-700 p-3 text-sm">
              Password changed successfully.
            </div>

            <div class="mt-4 flex justify-end">
              <button class="cursor-pointer px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800"
                      type="submit">
                Update password
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
</style>
