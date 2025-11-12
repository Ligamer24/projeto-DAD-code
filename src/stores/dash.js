import {defineStore} from 'pinia'
import axios from "axios";
import {inject} from "vue";

export const useDashStore = defineStore('dash', () => {
    const API_BASE_URL = inject("apiBaseURL");


    const getDash = () => {
        return axios.get(`${API_BASE_URL}/dashboard`);
    };

    return {getDash};
})
