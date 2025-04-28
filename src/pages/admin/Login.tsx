import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/home/Header";
import Navbar from "../../components/Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim() !== "" && telefone.trim() !== "") {
      navigate("/admin");
    } else {
      alert("Preencha todos os campos!");
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

        {/* Card de login com detalhe laranja */}
        <div className="relative z-10 w-full max-w-md mx-auto">
          {/* Faixa laranja */}
          <div className="absolute -top-2 left-0 w-full h-4 bg-orange rounded-t-xl z-0" />

          <div className="relative bg-white rounded-xl shadow-md p-8 text-center z-10">
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

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className=" block text-sm font-medium mb-2 text-gray-700">
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
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange mb-4"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange text-white font-semibold rounded-md py-2 hover:opacity-90 transition"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
