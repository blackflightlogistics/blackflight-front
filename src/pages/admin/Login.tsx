// src/pages/admin/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/home/Header";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const data = await authService.login({
        email,
        password: senha,
      });

      login(data.token); // Salva token no contexto + localStorage
      navigate("/admin"); // Redireciona para o painel
    } catch (err) {
      console.error(err);
      setErro("Credenciais inválidas. Verifique e tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />

      {/* Hero de fundo */}
      <div
        className="relative flex-1 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/home-bg.png')" }}
      >
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/50 z-0" />

        {/* Card de login */}
        <div className="relative z-10 bg-white rounded-xl shadow-md p-8 w-full max-w-md mx-auto">
          {/* Botão de fechar */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-primary text-black">
              Acesso administrativo
            </h2>
            <button
              onClick={() => navigate("/")}
              className="text-orange font-bold text-2xl hover:opacity-80"
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

            {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-orange text-white font-semibold rounded-md py-2 hover:opacity-90 transition"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
