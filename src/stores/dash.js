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

    const getHistory = () => {
        return axios.get(`${API_BASE_URL}/history`);
    };

    return {getDash, getHistory, getLeaderboard};
})
