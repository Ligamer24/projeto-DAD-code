import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import { useAPIStore } from "@/stores/api.js";
import { useAuthStore } from "@/stores/auth.js";

export const useShopStore = defineStore("shop", () => {
    const selectedDeck = ref(0);
    const api = useAPIStore();
    const authStore = useAuthStore();

    const items = ref([]);

    const fetchItems = async () => {
        const dbItems = await api.getShop().then(res => res.data);
        const defaultItem = {
            id: 0,
            name: 'Default Deck',
            price: 0,
            image: '/src/assets/cards/semFace_1.png',
            owned: true,
            isLocal: true
        };
        items.value = [defaultItem, ...dbItems];
    };

    const addItem = async (formData) => {
        await api.postShopItem(formData);
        await fetchItems();
    };

    const purchaseItem = async (id, price) => {
        await api.purchaseItem(id);
        await fetchItems();
        authStore.currentUser.coins_balance -= price;
    };

    const setSelectedDeck = (id) => {
        selectedDeck.value = id;
        api.updateSelectedDeck(id).then();
    };

    const getSelectedDeck = async () => {
        selectedDeck.value = await api.getSelectedDeck().then(res => res.data.deck) ?? 0;
    };

    return {
        selectedDeck,
        items,
        setSelectedDeck,
        getSelectedDeck,
        fetchItems,
        addItem,
        purchaseItem
    };
});
