// src/context/AuthContext.tsx
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextData {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem("token");
    if (tokenSalvo) {
      setToken(tokenSalvo);
    }
    setLoading(false); // Agora no mesmo useEffect
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
    navigate("/admin"); 
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
