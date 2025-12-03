import { defineStore } from "pinia";
import {onMounted, ref} from "vue";
import {useAPIStore} from "@/stores/api.js";

export const useShopStore = defineStore("shop", () => {
    const selectedDeck = ref(1);
    const api = useAPIStore();

    const setSelectedDeck = (id) => {
        selectedDeck.value = id;
        api.updateSelectedDeck(id).then();
    };

    const getSelectedDeck = async () => {
        selectedDeck.value = await api.getSelectedDeck().then(res => res.data.deck) ?? 1;
        console.log(selectedDeck.value);
    };

    onMounted(() => {
        getSelectedDeck().then();
    });

    return {
        selectedDeck,
        setSelectedDeck,
        getSelectedDeck
    };
});
