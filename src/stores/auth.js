import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {useAPIStore} from "./api";

export const useAuthStore = defineStore("auth", () => {
    const apiStore = useAPIStore();
    const currentUser = ref(undefined);
    const anonymous = ref(false);

    const BOT_ID = 2

    const isLoggedIn = computed(() => {
        return currentUser.value !== undefined;
    });
    
    const login = async (credentials) => {
        await apiStore.postLogin(credentials);
        const response = await getUser();
        // currentUser.value = response.data;
        // return response.data;
    };
    const logout = async () => {
        await apiStore.postLogout();
        currentUser.value = undefined;
    };

    const getUser = async () => {
    const response = await apiStore.getAuthUser()
    currentUser.value = response.data
  }

    return {
        currentUser,
        isLoggedIn,
        login,
        logout,
        getUser,
        anonymous,
        BOT_ID
    };
});
