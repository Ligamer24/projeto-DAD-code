import { defineStore } from "pinia";
import axios from "axios";
import { inject, ref } from "vue";
import { toast } from "vue-sonner";

export const useAPIStore = defineStore("api", () => {
    const API_BASE_URL = inject("apiBaseURL");

    const token = ref();
    const TOKEN_STORAGE_KEY = "auth_token";

    const setToken = (newToken) => {
        token.value = newToken;
        if (newToken) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    };

    const clearToken = () => {
        setToken(undefined);
    };

    const restoreTokenFromStorage = () => {
        const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (stored) {
            setToken(stored);
            return stored;
        }
        return null;
    };

    const postGame = (game) => {
        return axios.post(`${API_BASE_URL}/games`, game);
    };
    const getGames = () => {
        return axios.get(`${API_BASE_URL}/games`);
    };

    const postMatch = (match) => {
        return axios.post(`${API_BASE_URL}/matches`, match);
    };
    const getMatches = () => {
        return axios.get(`${API_BASE_URL}/matches`);
    };

    // COINS TRANSACTIONS
    const postCoinsTransaction = (coinsObj) => {
        return axios.post(`${API_BASE_URL}/coins`, coinsObj);
    };

    const updateCoinsUser = (coinsAmount) => {
        return axios.put(`${API_BASE_URL}/users/me/coins`, { amountToAdd: coinsAmount });
    };


    // AUTH
    const postLogin = async (credentials) => {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);
        const newToken = response.data.token;
        setToken(newToken);
        return newToken;
    };


    const postLogout = async () => {
        await axios.post(`${API_BASE_URL}/logout`);
        clearToken();
    };

    // Users
    const getUser = async (id) => {
        const response = await axios.get(`${API_BASE_URL}/users/${id}`);

        return response.data.data;
    }


    const getAuthUser = () => {
        return axios.get(`${API_BASE_URL}/users/me`);
    };

    const putUser = (user) => {
        return axios.put(`${API_BASE_URL}/users/me`, user);
    };


    const patchUserPhoto = (id, photo_url) => {
        return axios.patch(`${API_BASE_URL}/users/me/photo-url`, {
            photo_avatar_filename: photo_url,
        });
    };

    //Admins

    const getUsersAdmin = (page) => {
        return axios.get(`${API_BASE_URL}/admin/users?page=${page}`);
    }

    const blockUser = (id) => {
        return axios.patch(`${API_BASE_URL}/admin/users/${id}/block`);
    }

    const createAdmin = (adminForm) => {
        return axios.post(`${API_BASE_URL}/admin/create-admin`, adminForm);
    }

    const deleteUser = (id) => {
        return axios.delete(`${API_BASE_URL}/admin/users/${id}`);
    }

    const getTransactionsAdmin = (page) => {
        return axios.get(`${API_BASE_URL}/admin/transactions?page=${page}`);
    }

    const getGamesAdmin = (page, user = undefined) => {
        if (user) {
            return axios.get(`${API_BASE_URL}/admin/games?user_id=${user}&page=${page}`);
        }
        return axios.get(`${API_BASE_URL}/admin/games?page=${page}`);
    }

    const getMatchesAdmin = (page, user = undefined) => {
        if (user) {
            return axios.get(`${API_BASE_URL}/admin/matches?user_id=${user}&page=${page}`);
        }
        return axios.get(`${API_BASE_URL}/admin/matches?page=${page}`);
    }

    // Files
    const uploadProfilePhoto = async (file) => {

        const formData = new FormData();
        formData.append("photo", file);

        const uploadPromise = axios.post(
            `${API_BASE_URL}/files/userphoto`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        toast.promise(uploadPromise, {
            loading: "Uploading profile photo...",
            success: () => `Profile photo uploaded successfully`,
            error: (data) =>
                `Error uploading photo - ${data?.response?.data?.message}`,
        });

        return uploadPromise;
    };

    // UPDATE AVATAR (upload OU predefined)
    const updateAvatar = async (value, isPredefined = false) => {
        const form = new FormData();
        form.append("_method", "PUT");

        if (isPredefined) {
            // nome do ficheiro vindo do avatar predefinido
            form.append("predefined_avatar", value.split("/").pop());
        } else if (value instanceof File) {
            form.append("photo_avatar", value);
        }

        return axios.post(`${API_BASE_URL}/profile`, form);
    };

    // UPDATE PASSWORD
    const changePassword = async ({ current, next, confirm }) => {
        return axios.put(`${API_BASE_URL}/profile/password`, {
            current_password: current,
            password: next,
            password_confirmation: confirm,
        });
    };

    // SELECTED DECK
    const updateSelectedDeck = async (deckId) => {
        return axios.patch(`${API_BASE_URL}/users/me/select-deck`, {
            deck: deckId,
        });
    }

    const getSelectedDeck = async () => {
        return axios.get(`${API_BASE_URL}/users/me/select-deck`);
    }

    const sendStartGame = async () => {
        return axios.post(`${API_BASE_URL}/start-game`);
    }

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    const getVapidPublicKey = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get-vapid`);
            console.log('VAPID key response:', response.data);
            return response.data.publicKey;
        } catch (error) {
            console.error('Error fetching VAPID public key:', error);
            return null;
        }
    }

    const subscribeToPushNotifications = async () => {
        if (!('serviceWorker' in navigator)) {
            console.log('Service Worker not supported');
            return;
        }
        if (!('PushManager' in window)) {
            console.log('PushManager not supported');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            console.log('Service Worker ready:', registration);

            let vapid_Key = await getVapidPublicKey();
            console.log('VAPID Public Key:', vapid_Key);

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapid_Key),
            });
            console.log('Subscription object:', subscription);

            await axios.post(`${API_BASE_URL}/subscribe`, subscription);
            console.log('Subscription sent to backend');
            toast.success('Subscribed to notifications!');
        } catch (error) {
            console.error('Error subscribing to notifications:', error);
            toast.error('Failed to subscribe to notifications');
        }
    };

    const requestNotification = async () => {
        return axios.post(`${API_BASE_URL}/send`);
    }

    const getShop = async () => {
        return axios.get(`${API_BASE_URL}/shop`);
    }


    const postShopItem = async (formData) => {
        return axios.post(`${API_BASE_URL}/shop`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }

    const purchaseItem = async (itemId) => {
        return axios.post(`${API_BASE_URL}/shop/${itemId}/buy`);
    }

    return {
        token,
        setToken,
        clearToken,
        restoreTokenFromStorage,
        postGame,
        getGames,
        postMatch,
        getMatches,
        postCoinsTransaction,
        postLogin,
        postLogout,
        getUser,
        getUsersAdmin,
        blockUser,
        createAdmin,
        deleteUser,
        getTransactionsAdmin,
        getGamesAdmin,
        getMatchesAdmin,
        getAuthUser,
        updateAvatar,
        patchUserPhoto,
        putUser,
        uploadProfilePhoto,
        changePassword,
        updateCoinsUser,
        updateSelectedDeck,
        getSelectedDeck,
        sendStartGame,
        subscribeToPushNotifications,
        requestNotification,
        getShop,
        postShopItem,
        purchaseItem
    };
});
