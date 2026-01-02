import {defineStore} from "pinia";


export const useEmotesStore = defineStore("emotes", () => {

    const EMOTES = [
        {id: 1, image: "hihihiha.gif", sound: 'hihihiha.mp3'},
        {id: 2, image: "dog.gif", sound: 'dog.mp3'},
    ];

    const getEmotes = () => {
        return EMOTES;
    };

    const getEmoteById = (id) => {
        return EMOTES.find(emote => emote.id === id);
    };

    return {
        getEmotes,
        getEmoteById
    };
});
