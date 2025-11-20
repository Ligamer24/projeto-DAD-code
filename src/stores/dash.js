import {defineStore} from 'pinia'
import axios from "axios";
import {inject} from "vue";

export const useDashStore = defineStore('dash', () => {
    const API_BASE_URL = inject("apiBaseURL");

    const getDash = () => {
        return axios.get(`${API_BASE_URL}/dashboard`);
    };

    const getLeaderboard = async (page = 1, orderBy = null) => {
        // orderBy: null | 'wins' | 'coins' | 'achievements' | 'rating'
        let url = `${API_BASE_URL}/leaderboard?page=${page}`
        if (orderBy) url += `&order_by=${orderBy}`
        const { data } = await axios.get(url)
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

    const getPersonalScore = async () => {
        // returns: { matches, wins, win_rate, capote, bandeira }
        const { data } = await axios.get(`${API_BASE_URL}/users/me/score`)
        return data
    }

    return {getDash, getHistory, getLeaderboard, getGame, getPersonalScore};
})
