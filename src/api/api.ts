import axios from "axios";
import { getToken, clearAuth } from "../utils/storage";

const api = axios.create({
  baseURL: "https://black-fligth.fly.dev/api/v1",
});

// Intercepta cada request para adicionar o token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepta as respostas para capturar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirou ou inválido
      clearAuth();
      window.location.href = "/admin/login"; // Redireciona para login
    }
    return Promise.reject(error);
  }
);

export default api;
