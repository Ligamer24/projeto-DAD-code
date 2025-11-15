import {defineStore} from 'pinia'
import axios from "axios";
import {inject} from "vue";

export const useDashStore = defineStore('dash', () => {
    const API_BASE_URL = inject("apiBaseURL");

    const getDash = () => {
        return axios.get(`${API_BASE_URL}/dashboard`);
    };

    const getLeaderboard = async (page = 1) => {
        const { data } = await axios.get(`${API_BASE_URL}/leaderboard?page=${page}`)
        return data
    }

    const getHistory = (page = 1, filter = null) => {
        // filter: null | 'with' | 'without'
        let url = `${API_BASE_URL}/history?page=${page}`;
        if (filter === 'with') url += `&has_match=1`;
        if (filter === 'without') url += `&has_match=0`;
        return axios.get(url);
    };

    const getGame = (game_id) => {
        return axios.get(`${API_BASE_URL}/games/${game_id}`);   
    }

    return {getDash, getHistory, getLeaderboard, getGame};
})
