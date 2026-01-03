import { ALL_CARDS } from "./constants.js";

const createShuffledDeck = () => {
    
    let deck = JSON.parse(JSON.stringify(ALL_CARDS)); // Deep copy
    
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

const distributeCards = (deckSource,type) => {

    let deck = [...deckSource]

    const trunfo = deck[0];
    trunfo.used = false;
    const trumpSuit = trunfo.suit    
    
    deck = deck.slice(1);
    
    const player1Hand = deck.slice(0, type);
    const player2Hand = deck.slice(type, type*2);
    
    const remainingDeck = deck.slice(type*2);

    return {
        trunfo,
        trumpSuit,
        player1Hand,
        player2Hand,
        deck: remainingDeck
    }
}

export const setupNewGame = (type) => {

    const fullDeck = createShuffledDeck()
    const gameData = distributeCards(fullDeck, type)

    return gameData;
}

export const getCardStrength = (cardId) => {
    // Extrai o número da carta (ex: "c7" -> "7")
    const rank = parseInt(cardId.substring(1));

    switch (rank) {
        case 1:
            return 20; // Ás
        case 7:
            return 19; // Sete
        case 13:
            return 18; // Rei
        case 11:
            return 17; // Valete
        case 12:
            return 16; // Dama
        default:
            return rank; // 6, 5, 4, 3, 2 valem o seu número
    }
};