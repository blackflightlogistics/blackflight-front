import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { saveToken, saveAccountId } from "../../utils/storage";

import Header from "../../components/home/Header";
import { authService } from "../../api/authService";
import { useAuth } from "../../context/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { token, account_id } = await authService.login({
        email,
        password: senha,
      });

      saveToken(token);
      saveAccountId(account_id);
      login(token); // Atualiza contexto também

      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div
        className="relative flex-1 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/home-bg.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/50 z-0" />

        <div className="relative z-10 bg-white rounded-xl shadow-md p-8 w-full max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-primary text-black">
              Acesso administrativo
            </h2>
            <button
              onClick={() => navigate("/")}
              className="text-orange font-bold text-xl hover:opacity-80"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange text-white font-semibold rounded-md py-2 hover:opacity-90 transition"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-gray-400 text-white font-semibold rounded-md py-2 hover:opacity-90 transition"
            >
              Voltar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
