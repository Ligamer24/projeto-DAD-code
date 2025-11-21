import {defineStore} from "pinia";
import {ref} from "vue";

/*
    Ás (1): 11 pontos
    Três: 10 pontos
    Rei (13): 4 pontos
    Rainha (12): 3 pontos
    Valete (11): 2 pontos
    Sete, Seis, Cinco, Quatro e Dois: 0 pontos

*/

const cards = [
    {card: "c1", value: 11},
    {card: "c2", value: 0},
    {card: "c3", value: 10},
    {card: "c4", value: 0},
    {card: "c5", value: 0},
    {card: "c6", value: 0},
    {card: "c7", value: 0},
    {card: "c11", value: 2},
    {card: "c12", value: 3},
    {card: "c13", value: 4},
    {card: "e1", value: 11},
    {card: "e2", value: 0},
    {card: "e3", value: 10},
    {card: "e4", value: 0},
    {card: "e5", value: 0},
    {card: "e6", value: 0},
    {card: "e7", value: 0},
    {card: "e11", value: 2},
    {card: "e12", value: 3},
    {card: "e13", value: 4},
    {card: "o1", value: 11},
    {card: "o2", value: 0},
    {card: "o3", value: 10},
    {card: "o4", value: 0},
    {card: "o5", value: 0},
    {card: "o6", value: 0},
    {card: "o7", value: 0},
    {card: "o11", value: 2},
    {card: "o12", value: 3},
    {card: "o13", value: 4},
    {card: "p1", value: 11},
    {card: "p2", value: 0},
    {card: "p3", value: 10},
    {card: "p4", value: 0},
    {card: "p5", value: 0},
    {card: "p6", value: 0},
    {card: "p7", value: 0},
    {card: "p11", value: 2},
    {card: "p12", value: 3},
    {card: "p13", value: 4},
]

export const useGameStore = defineStore("game", () => {
    const deck = ref([]);

    function shuffle() {
        deck.value = [...cards];
        for (let i = deck.value.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck.value[i], deck.value[j]] = [deck.value[j], deck.value[i]];
        }
    }

    const player1Hand = ref([]);
    const player2Hand = ref([]);

    function getFirstCardsToHands() {
        player1Hand.value = deck.value.slice(0, 9);
        player2Hand.value = deck.value.slice(9, 18);
        deck.value = deck.value.slice(18);
    }


    return {
        deck, shuffle,
        player1Hand, player2Hand,
        getFirstCardsToHands
    };
});
