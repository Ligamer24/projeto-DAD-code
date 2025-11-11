<template>
  <div
    class="min-h-screen w-full bg-gradient-to-b from-lime-300 to-yellow-300 flex flex-col items-center justify-center p-6"
  >
    <img
      :src="biscaLogo"
      alt="Bisca Royal Logo"
      class="w-78 mb-0 opacity-95 drop-shadow-md relative"
    />

    <div
      class="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-black/10 p-6 -translate-y-10"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <label class="block">
          <span class="text-sm font-medium text-black/80">Email</span>
          <input
            v-model="email"
            type="email"
            required
            aria-label="Email"
            placeholder="my@email.com"
            class="mt-1 block w-full rounded-xl border border-black/10 bg-white/60 px-4 py-3 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </label>

        <label class="block">
          <span class="text-sm font-medium text-black/80">Password</span>
          <input
            v-model="password"
            type="password"
            required
            aria-label="Password"
            placeholder="••••••••"
            class="mt-1 block w-full rounded-xl border border-black/10 bg-white/60 px-4 py-3 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </label>

        <div class="flex items-center justify-between text-sm text-black/75">
          <label class="inline-flex items-center gap-2">
            <input
              type="checkbox"
              v-model="remember"
              class="rounded-sm mt-1 cursor-pointer"
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            class="text-black/70 underline hover:text-black/90 cursor-pointer"
            @click="forgot"
          >
            Forgot password
          </button>
        </div>

        <button
          type="submit"
          class="w-full mt-1 cursor-pointer rounded-xl py-3 font-semibold shadow-sm transition transform active:scale-[.99]"
          :class="[
            'bg-emerald-700 text-white',
            loading ? 'opacity-70 pointer-events-none' : 'hover:bg-emerald-600',
          ]"
          aria-label="Log in"
        >
          <span v-if="!loading">Log in</span>
          <span v-else>Logging in...</span>
        </button>
      </form>

      <footer class="mt-6 text-center text-xs text-black/60">
        <div class="h-px w-full bg-black/10 my-4" />
        <p>
          Don't have an account?
          <router-link
            to="/register"
            
            class="underline font-medium cursor-pointer"
            >Register</router-link
          >
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useAuthStore } from "@/stores/auth";
import biscaLogo from "@/assets/bisca_logo.png";

const router = useRouter();
const authStore = useAuthStore()
const email = ref("");
const password = ref("");
const remember = ref(false);
const loading = ref(false);

const formData = ref({
    email: email.value,
    password: password.value
})

const handleSubmit = async () => {

    toast.promise(authStore.login(formData.value), {
        loading: 'Calling API',
        success: (data) => {
            router.push('/dashboard')
            return `Login Sucessfull - ${data?.name}`
        },
        error: (data) => `[API] Error saving game - ${data?.response?.data?.message}`,
    })


}

function forgot() {
  alert("Password recovery flow");
}
</script>
