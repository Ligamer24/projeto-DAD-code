import { defineStore } from "pinia";
import axios from "axios";
import { ref, inject } from "vue";
export const useAPIStore = defineStore("api", () => {
  const API_BASE_URL = inject("apiBaseURL");

  const postGame = (game) => {
    return axios.post(`${API_BASE_URL}/games`, game);
  };
  const getGames = () => {
    return axios.get(`${API_BASE_URL}/games`);
  };

  const token = ref();
  // AUTH
  const postLogin = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    token.value = response.data.token;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
  };
  const postLogout = async () => {
    await axios.post(`${API_BASE_URL}/logout`);
    token.value = undefined;
    delete axios.defaults.headers.common["Authorization"];
  };
  // Users
  const getAuthUser = () => {
    return axios.get(`${API_BASE_URL}/users/me`);
  };

  const updateProfile = async (data) => {
    return axios.put(`${API_BASE_URL}/profile`, data);
  };

  // UPDATE AVATAR (upload OU predefined)
  const updateAvatar = async (value, isPredefined = false) => {
    const form = new FormData();
    form.append("_method", "PUT");

    if (isPredefined) {
      // nome do ficheiro vindo do avatar predefinido
      form.append("predefined_avatar", value.split("/").pop());
    } else if (value instanceof File) {
      form.append("photo_avatar", value);
    }

    return axios.post(`${API_BASE_URL}/profile`, form);
  };

  // UPDATE PASSWORD
  const changePassword = async ({ current, next, confirm }) => {
    return axios.put(`${API_BASE_URL}/profile/password`, {
      current_password: current,
      password: next,
      password_confirmation: confirm,
    });
  };

  return {
    postGame,
    getGames,
    postLogin,
    postLogout,
    getAuthUser,
    updateProfile,
    updateAvatar,
    changePassword,
  };
});
