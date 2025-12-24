<template>

    <div
        class="mt-5 max-w-7xl mx-auto bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden px-6 py-4 flex items-center justify-start gap-6">
        <RouterLink to="/transactionsPage"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all">
            See all transactions

        </RouterLink>
        <!-- <RouterLink
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all">
            See all games
        </RouterLink>
        <RouterLink
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all">
            See all matches
        </RouterLink> -->
    </div>

    <div
        class="mt-5 max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div class="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <h1 class="text-2xl font-bold text-gray-800">System users</h1>
            <button @click="isOpen = true"
                class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all">
                + Add New Admin
            </button>

            <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="isOpen"
                    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

                    <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 scale-95"
                        enter-to-class="opacity-100 scale-100" leave-active-class="duration-200 ease-in"
                        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" @click.stop>

                            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 class="text-xl font-bold text-gray-800">New Admin</h3>
                                <button @click="isOpen = false"
                                    class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                            </div>

                            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input v-model="form.name" type="text" placeholder="Ex: Ana Souza"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                        required>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                    <input v-model="form.email" type="email" placeholder="ana@empresa.com"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                        required>
                                    <p v-if="errors.email" class="text-red-500 text-xs mt-1">
                                        {{ errors.email[0] }}
                                    </p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input v-model="form.password" type="password" placeholder="********"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                        required>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Access level</label>
                                    <input type="text" value="Admin" disabled
                                        class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed font-medium outline-none">
                                </div>

                                <div class="flex justify-end gap-3 pt-4">
                                    <button type="button" @click="isOpen = false"
                                        class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition">
                                        Save Admin
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Transition>
                </div>
            </Transition>
        </div>

        <div class="divide-y divide-gray-50">
            <div v-for="user in users" :key="user.id" :class="{ 'opacity-50': user.blocked === 1 }"
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
                    <span>
                        <button v-if="authStore.currentUser.id !== user.id" @click="openDeleteModal(user)"
                            class="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full">
                            Delete
                        </button>
                        <div v-if="isDeleteModalOpen"
                            class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-opacity">
                            <div
                                class="relative bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full transform transition-all border border-gray-100">

                                <button @click="isDeleteModalOpen = false"
                                    class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <div
                                    class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                                    <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>

                                <div class="text-center mb-8">
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">Delete User</h3>
                                    <p class="text-sm text-gray-500">
                                        Are you sure you want to delete the user <span
                                            class="font-semibold text-gray-900">{{
                                                userToDelete?.name }}</span>?
                                        This action cannot be undone.
                                    </p>
                                </div>

                                <div class="flex flex-col sm:flex-row-reverse gap-3">
                                    <button @click="handleDelete(userToDelete?.id)"
                                        class="w-full inline-flex justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:ring-4 focus:ring-red-200 transition-all">
                                        Yes, delete
                                    </button>

                                    <button @click="isDeleteModalOpen = false"
                                        class="w-full inline-flex justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 transition-all">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </span>
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
            <div class="flex items-center gap-2 text-sm font-medium text-gray-500">
                <span>Page</span>
                <input type="number" :value="currentPage" @keyup.enter="handlePageJump($event)"
                    @blur="handlePageJump($event)"
                    class="w-12 h-8 text-center font-bold text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="1" :max="totalPages">
                <span>of {{ totalPages }}</span>
            </div>

            <div class="flex items-center gap-3">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-5 py-2 text-xs font-black uppercase tracking-widest border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0">
                    Previous
                </button>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-5 py-2 text-xs font-black uppercase tracking-widest border-2 border-black bg-lime-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0">
                    Next
                </button>
            </div>
        </div>

    </div>


</template>
<script setup>
import { ref, onMounted, inject } from 'vue';
import { useAPIStore } from '@/stores/api';
import { useAuthStore } from "@/stores/auth.js";
import { toast } from 'vue-sonner';




const api = useAPIStore();
const authStore = useAuthStore();


const serverBaseURL = inject("baseURL");

const isDeleteModalOpen = ref(false)


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

const handlePageJump = (event) => {
    const page = parseInt(event.target.value);

    // Validação: Se não for número ou estiver fora do limite, volta para a página atual
    if (isNaN(page) || page < 1 || page > totalPages.value) {
        event.target.value = currentPage.value;
        return;
    }

    fetchUsers(page);
};

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

//Funcoes para o modal do adicionar admin

// Estado para controlar a visibilidade
const isOpen = ref(false)

// Estado reativo para os dados do formulário
const form = ref({
    name: '',
    email: '',
    password: '',
    type: 'A'
})

// Ref para armazenar erros de validação
const errors = ref({})

// Função de submissão
const handleSubmit = async () => {
    errors.value = {}

    try {

        //chama a api para criar o admin
        const response = await api.createAdmin(form.value);

        isOpen.value = false
        toast.success('Admin added successfully!')

        //Atualiza a pagina de users na ultima pagina
        fetchUsers(totalPages.value);

        // Limpa o formulário
        form.value = { name: '', email: '', password: '', type: 'A' }

    } catch (error) {
        if (error.response && error.response.status === 422) {
            // O Laravel retorna os erros dentro de response.data.errors
            errors.value = error.response.data.errors
        } else {
            alert('Ocorreu um erro inesperado.')
        }
    }
}

const userToDelete = ref(null)


//Modal delete
const openDeleteModal = (user) => {
    userToDelete.value = user
    isDeleteModalOpen.value = true // Abre o modal
}

//Faz o delete real
const handleDelete = async (id) => {
    await api.deleteUser(id)
    isDeleteModalOpen.value = false

    toast.success('User deleted successfully!')
    fetchUsers(currentPage.value); // Refresh da lista de users
}

onMounted(() => {
    fetchUsers();
});

</script>