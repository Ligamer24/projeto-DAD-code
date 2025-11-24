import { defineStore } from "pinia";
import axios from "axios";
import { inject } from "vue";

export const useDashStore = defineStore("dash", () => {
  const API_BASE_URL = inject("apiBaseURL");
  const getDash = () => {
    return axios.get(`${API_BASE_URL}/dashboard`);
  };

  const getLeaderboard = async (page = 1) => {
    const { data } = await axios.get(
      `${API_BASE_URL}/leaderboard?page=${page}`
    );
    return data;
  };

  const getGame = (game_id) => {
    return axios.get(`${API_BASE_URL}/games/${game_id}`);
  };

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

  const getGamesByMatch = (match_id) => {
    return axios.get(`${API_BASE_URL}/games?match_id=${match_id}`);
  };

  return {
    getDash,
    getLeaderboard,
    getGame,
    getGames,
    getMatches,
    getGamesByMatch,
  };
});
