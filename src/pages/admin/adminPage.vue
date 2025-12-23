<template>


    <div
        class="mt-5 max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">

        <div class="px-8 py-6 border-b border-gray-100">
            <h1 class="text-2xl font-bold text-gray-800">Utilizadores do Sistema</h1>
        </div>

        <div class="divide-y divide-gray-50">
            <div v-for="user in users" :key="user.id"
                class="px-8 py-5 flex items-center justify-between hover:bg-lime-50/50 transition-colors group">

                <div class="flex items-center gap-4">
                    <div
                        class="size-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-lime-200 group-hover:text-lime-700 transition-colors">
                        <img v-if="user.photo_avatar_filename"
                            :src="`${serverBaseURL}/storage/photos_avatars/${user.photo_avatar_filename}`"
                            class="rounded-3xl"></img>
                        <span v-else class="font-bold">{{ user.name.charAt(0).toUpperCase() }}</span>

                    </div>

                    <div>
                        <h2 class="font-semibold text-gray-900 leading-none">{{ user.name }}</h2>
                        <span class="text-sm text-gray-500 italic">{{ user.nickname ? '@' + user.nickname : 'N/A'
                            }}</span>
                    </div>
                </div>

                <div class="flex items-center gap-8">
                    <span v-if="user.blocked === 1">
                        <button @click="blockUser(user)"
                            class="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full">
                            Unblock
                        </button>
                    </span>
                    <span v-else>

                        <button v-if="authStore.currentUser.id !== user.id" @click="blockUser(user)"
                            class="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full">
                            Block
                        </button>

                    </span>
                    <span class="text-sm text-gray-400 font-mono">{{ user.email }}</span>

                    <span :class="[
                        'text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md border',
                        user.type === 'A' ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-400 border-gray-200'
                    ]">
                        {{ user.type === 'A' ? 'Admin' : 'User' }}
                    </span>
                </div>

            </div>
        </div>
        <div class="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <div class="text-sm font-medium text-gray-500">
                Página <span class="text-black font-bold">{{ currentPage }}</span> de {{ totalPages }}
            </div>

            <div class="flex items-center gap-3">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-5 py-2 text-xs font-black uppercase tracking-widest border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0">
                    Anterior
                </button>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-5 py-2 text-xs font-black uppercase tracking-widest border-2 border-black bg-lime-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0">
                    Próximo
                </button>
            </div>
        </div>

    </div>


</template>
<script setup>
import { ref, onMounted, inject } from 'vue';
import { useAPIStore } from '@/stores/api';
import { useAuthStore } from "@/stores/auth.js";
import { storeToRefs } from "pinia";




const api = useAPIStore();
const authStore = useAuthStore();


const serverBaseURL = inject("baseURL");

const { currentUser } = storeToRefs(authStore);


const users = ref([]);
const currentPage = ref(1)
const totalPages = ref(1)

//Get users function
const fetchUsers = async (page = 1) => {
    try {
        const response = await api.getUsersAdmin(page);
        users.value = response.data.data;
        totalPages.value = response.data.last_page;
        currentPage.value = response.data.current_page;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

//Block user function
const blockUser = async (user) => {

    try {
        await api.blockUser(user.id);
        //page refresh
        fetchUsers(currentPage.value);
    } catch (error) {
        console.error('Error blocking user:', error);
    }
}

//Pagination function
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        fetchUsers(currentPage.value + 1)
    }
}

const prevPage = () => {
    if (currentPage.value > 1) {
        fetchUsers(currentPage.value - 1)
    }
}

onMounted(() => {
    fetchUsers();
});

</script>