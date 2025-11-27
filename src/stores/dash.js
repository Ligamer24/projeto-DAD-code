import { defineStore } from "pinia";
import axios from "axios";
import { inject } from "vue";

export const useDashStore = defineStore("dash", () => {
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

    const getPersonalScore = async () => {
        // returns: { matches, wins, win_rate, capote, bandeira }
        const { data } = await axios.get(`${API_BASE_URL}/users/me/score`)
        return data
    }

    const getGames = ({ page = 1, result, sortOrder, from, to }) => {
    return axios.get(`${API_BASE_URL}/games`, {
      params: {
        page,
        result,
        sortOrder,
        from,
        to,
      },
    });
  };
  const getGamesByMatch = (match_id) => {
    return axios.get(`${API_BASE_URL}/games?match_id=${match_id}`);
  };
  const getMatches = ({ page = 1, result, sortOrder, from, to }) => {
    return axios.get(`${API_BASE_URL}/matches`, {
      params: {
        page,
        result,
        sortOrder,
        from,
        to,
      },
    });
  };

    return {getDash, getHistory, getLeaderboard, getGame, getGames, getPersonalScore, getMatches, getGamesByMatch};
})
