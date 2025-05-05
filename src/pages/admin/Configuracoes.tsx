// src/pages/admin/Configuracoes.tsx
import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { configService } from "../../services/configService";

const Configuracoes = () => {
  const [precoPorQuilo, setPrecoPorQuilo] = useState("");
  const [precoSeguro, setPrecoSeguro] = useState("");
  const [adicionalExpresso, setAdicionalExpresso] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarConfiguracoes = async () => {
      const config = await configService.buscar();
      setPrecoPorQuilo(config.amountPerKg);
      setPrecoSeguro(config.insurancePerc);
      setAdicionalExpresso(config.expressAmount);
      setCarregando(false);
    };
    carregarConfiguracoes();
  }, []);

  const salvar = async () => {
    await configService.atualizar({
      amount_per_kg: precoPorQuilo,
      insurance_perc: precoSeguro,
      express_amount: adicionalExpresso,
    });
    setMensagem("Configuração salva com sucesso!");
    setTimeout(() => setMensagem(""), 3000);
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#fcf7f1]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded"
        onClick={() => setSidebarAberta(true)}
      >
        ☰ Menu
      </button>

      <Sidebar mobileAberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} />

      <main className="flex-1 p-6 pt-20 bg-[#fcf7f1]  max-w-xxl space-y-6">
        <h1 className="text-2xl font-bold font-primary">Configurações do Sistema</h1>

        <div className="space-y-4 bg-white p-4 max-w-xl rounded border border-orange">
          <div>
            <label className="block text-sm font-medium font-secondary mb-1">
              Preço por Quilo (R$)
            </label>
            <input
              type="text"
              value={precoPorQuilo}
              onChange={(e) => setPrecoPorQuilo(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-secondary mb-1">
              % de valor do Seguro
            </label>
            <input
              type="text"
              value={precoSeguro}
              onChange={(e) => setPrecoSeguro(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-secondary mb-1">
              Valor adicional expresso (R$)
            </label>
            <input
              type="text"
              value={adicionalExpresso}
              onChange={(e) => setAdicionalExpresso(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
        </div>

        <button
          onClick={salvar}
          className="bg-orange text-white px-4 py-2 rounded hover:opacity-90 font-secondary"
        >
          Salvar Configuração
        </button>

        {mensagem && <p className="text-green-600 font-secondary">{mensagem}</p>}
      </main>
    </div>
  );
};

export default Configuracoes;
