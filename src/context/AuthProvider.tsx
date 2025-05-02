import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, AuthContextData } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem("token");
    if (tokenSalvo) setToken(tokenSalvo);
    setLoading(false);
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

  const contextValue: AuthContextData = {
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
