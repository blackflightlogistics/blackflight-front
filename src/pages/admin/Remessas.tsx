import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { remessaService, Remessa } from "../../services/remessaService";
import { encomendaService, Encomenda } from "../../services/encomendaService";
import { Link } from "react-router-dom";

const Remessas = () => {
  const [remessas, setRemessas] = useState<Remessa[]>([]);
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [statusFiltro, setStatusFiltro] = useState<string>("todos");
  const [buscaPais, setBuscaPais] = useState<string>("");
  const [sidebarAberta, setSidebarAberta] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      const [remessasData, encomendasData] = await Promise.all([
        remessaService.listar(),
        encomendaService.listar(),
      ]);
      setRemessas(remessasData);
      setEncomendas(encomendasData);
    };
    carregar();
  }, []);

  const fecharRemessa = async (id: number) => {
    await remessaService.atualizarStatus(id, "fechada");
    const atualizadas = await remessaService.listar();
    setRemessas(atualizadas);
  };

  const enviarRemessa = async (id: number) => {
    await remessaService.atualizarStatus(id, "enviada");
    const atualizadas = await remessaService.listar();
    setRemessas(atualizadas);
  };

  const remessasFiltradas = remessas.filter((r) => {
    const statusOk = statusFiltro === "todos" || r.status === statusFiltro;
    const paisOk = r.pais.toLowerCase().includes(buscaPais.toLowerCase());
    return statusOk && paisOk;
  });

  const renderStatusIcone = (status: string) => {
    switch (status) {
      case "aberta":
        return <span className="text-gray-500">⚪</span>;
      case "fechada":
        return <span className="text-yellow-500">🟡</span>;
      case "enviada":
        return <span className="text-green-600">🟢</span>;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Sidebar fixa */}
      <div className="md:fixed md:top-0 md:left-0 md:h-screen md:w-64 bg-white border-r z-10">
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded"
          onClick={() => setSidebarAberta(true)}
        >
          ☰ Menu
        </button>

        <Sidebar
          mobileAberta={sidebarAberta}
          onFechar={() => setSidebarAberta(false)}
        />
      </div>

      {/* Conteúdo principal com scroll */}
      <main className="md:ml-64 h-full overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Remessas</h1>
          <Link
            to="/admin/remessas/nova"
            className="px-4 py-2 bg-black text-white rounded hover:opacity-80"
          >
            Nova Remessa
          </Link>
          <div className="flex space-x-4">
            <select
              className="border p-2 rounded"
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
            >
              <option value="todos">Todos os status</option>
              <option value="aberta">Abertas</option>
              <option value="fechada">Fechadas</option>
              <option value="enviada">Enviadas</option>
            </select>
            <input
              type="text"
              placeholder="Buscar por país..."
              className="border p-2 rounded"
              value={buscaPais}
              onChange={(e) => setBuscaPais(e.target.value)}
            />
          </div>
        </div>

        {remessasFiltradas.length === 0 ? (
          <p className="text-gray-600">
            Nenhuma remessa encontrada com os filtros.
          </p>
        ) : (
          <ul className="space-y-4">
            {remessasFiltradas.map((r) => {
              const encomendasDaRemessa = encomendas.filter((e) =>
                r.encomendaIds.includes(e.id)
              );
              return (
                <li key={r.id} className="p-4 bg-white rounded shadow border">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <Link
                        to={`/admin/remessas/${r.id}`}
                        className="text-lg font-semibold hover:underline"
                      >
                        {renderStatusIcone(r.status)} País: {r.pais}
                      </Link>
                      <p className="text-sm text-gray-600">
                        Status: <strong>{r.status}</strong>
                      </p>
                      <p className="text-sm text-gray-600">
                        Criada em:{" "}
                        {new Date(r.dataCriacao).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Peso Atual:</p>
                      <p
                        className={`text-xl font-bold ${
                          r.pesoTotal >= 23
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {r.pesoTotal.toFixed(2)} kg
                      </p>
                    </div>
                  </div>

                  {encomendasDaRemessa.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-semibold mb-1">Encomendas:</p>
                      <ul className="space-y-1 text-sm">
                        {encomendasDaRemessa.map((e) => (
                          <li
                            key={e.id}
                            className="pl-2 border-l-4 border-blue-300"
                          >
                            <span className="font-medium">#{e.id}</span> –{" "}
                            {e.pacotes.length} pacote(s),{" "}
                            {e.pacotes
                              .reduce((soma, p) => soma + p.peso, 0)
                              .toFixed(2)}{" "}
                            kg
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Botões de ação */}
                  {r.status === "aberta" && r.pesoTotal >= 23 && (
                    <button
                      onClick={() => fecharRemessa(r.id)}
                      className="mt-4 px-4 py-2 bg-green-600 text-black rounded hover:bg-green-700"
                    >
                      Fechar Remessa
                    </button>
                  )}

                  {r.status === "fechada" && (
                    <button
                      onClick={() => enviarRemessa(r.id)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700"
                    >
                      Enviar Remessa
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Remessas;
