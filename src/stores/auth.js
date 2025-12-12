import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAPIStore } from "./api";

export const useAuthStore = defineStore("auth", () => {
    const apiStore = useAPIStore();
    const currentUser = ref(undefined);
    const anonymous = ref(false);

    const BOT_ID = 2;
    const TOKEN_STORAGE_KEY = "auth_token";
    const initialized = ref(false);
    const rememberMe = ref(false);

    const isLoggedIn = computed(() => {
        return currentUser.value !== undefined;
    });

    const isAdmin = computed(() => {
        return currentUser.value?.type === "A";
    });


    const setStoredToken = (token, remember) => {
        if (remember && token) {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
        rememberMe.value = !!remember && !!token;
    };

    const login = async (credentials, options = {}) => {
        const remember = !!options.remember;
        const token = await apiStore.postLogin(credentials);
        setStoredToken(token, remember);
        await getUser();
        return currentUser.value;
    };

    const logout = async () => {
        await apiStore.postLogout();
        currentUser.value = undefined;
        anonymous.value = false;
        setStoredToken(undefined, false);
    };

    const getUser = async () => {
        const response = await apiStore.getAuthUser();
        currentUser.value = response.data;
        return response;
    };

    const initializeAuth = async () => {
        if (initialized.value) return;
        initialized.value = true;
        const storedToken = apiStore.restoreTokenFromStorage();
        if (storedToken) {
            try {
                await getUser();
                rememberMe.value = true;
            } catch (e) {
                // Token invalid or expired; clear it
                setStoredToken(undefined, false);
                apiStore.clearToken();
            }
        }
    };

    return {
        currentUser,
        isLoggedIn,
        login,
        logout,
        getUser,
        anonymous,
        BOT_ID,
        initializeAuth,
        rememberMe,
        isAdmin,
    };
});
