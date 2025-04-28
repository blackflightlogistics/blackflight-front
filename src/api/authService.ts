import api from "./api";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  account_id: string;
  token: string;
}

export const authService = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
};
