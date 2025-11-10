<template>
    <div
        class="min-h-screen w-full bg-gradient-to-b from-lime-300 to-yellow-300 flex flex-col items-center justify-center p-6">
        <img :src="biscaLogo" alt="Logo Bisca Royal" class="w-78 mb-0 opacity-95 drop-shadow-md relative top-1" />

        <div
            class="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-black/10 p-6 -translate-y-10">
            <form @submit.prevent="register" class="space-y-4">
                <label class="block">
                    <span class="text-sm font-medium text-black/80">Nome</span>
                    <input v-model="name" type="text" required placeholder="O teu nome"
                        class="mt-1 block w-full rounded-xl border border-black/10 bg-white/60 px-4 py-3 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
                </label>

                <label class="block">
                    <span class="text-sm font-medium text-black/80">Email</span>
                    <input v-model="email" type="email" required placeholder="meu@email.com"
                        class="mt-1 block w-full rounded-xl border border-black/10 bg-white/60 px-4 py-3 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
                </label>

                <label class="block">
                    <span class="text-sm font-medium text-black/80">Password</span>
                    <input v-model="password" type="password" required placeholder="••••••••"
                        class="mt-1 block w-full rounded-xl border border-black/10 bg-white/60 px-4 py-3 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
                </label>

                <label class="block">
                    <span class="text-sm font-medium text-black/80">Confirmar Password</span>
                    <input v-model="confirmPassword" type="password" required placeholder="••••••••"
                        class="mt-1 block w-full rounded-xl border border-black/10 bg-white/60 px-4 py-3 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
                </label>

                <button type="submit"
                    class="w-full mt-1 rounded-xl py-3 font-semibold shadow-sm transition transform active:scale-[.99] cursor-pointer"
                    :class="[
                        'bg-emerald-700 text-white',
                        loading ? 'opacity-70 pointer-events-none' : 'hover:bg-emerald-600'
                    ]">
                    <span v-if="!loading">Registar</span>
                    <span v-else>A criar conta...</span>
                </button>
            </form>

            <footer class="mt-6 text-center text-xs text-black/60">
                <div class="h-px w-full bg-black/10 my-4" />
                <p>
                    Já tens conta?
                    <router-link to="/login" class="underline font-medium cursor-pointer hover:text-black/70">
                        Entrar
                    </router-link>
                </p>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import biscaLogo from '@/assets/bisca_logo.png'
import { RouterLink } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

function register() {
    if (password.value !== confirmPassword.value) {
        alert('As passwords não coincidem!')
        return
    }

    loading.value = true
    setTimeout(() => {
        loading.value = false
        alert(`Conta criada para ${name.value} (${email.value})`)
    }, 800)
}


</script>
