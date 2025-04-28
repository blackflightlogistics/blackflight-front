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
  const [acoesAbertas, setAcoesAbertas] = useState<number | null>(null);

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
      <div className="md:fixed md:top-0 md:left-0 md:h-screen md:w-64 bg-black text-white z-10">
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

      {/* Conteúdo principal */}
      <main className="md:ml-64 h-full overflow-y-auto bg-[#fcf8f5] p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold font-primary text-black">
            Remessas
          </h1>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/admin/remessas/nova"
              className="px-4 py-2 bg-orange text-white font-semibold rounded hover:opacity-90 transition text-sm"
            >
              Nova Remessa
            </Link>

            <select
              className="border border-gray-300 bg-white p-2 rounded text-sm"
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
              placeholder="Buscar país..."
              className="border border-gray-300 bg-white p-2 rounded text-sm"
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
                <li
                  key={r.id}
                  className="bg-white p-6 rounded-xl border border-orange"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {renderStatusIcone(r.status)}
                        <p className="text-lg font-semibold text-black">
                          {r.pais}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Status: <strong>{r.status}</strong>
                      </p>
                      <p className="text-sm text-gray-600">
                        Criada em:{" "}
                        {new Date(r.dataCriacao).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Peso Atual</p>
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

                      <Link
                        to={`/admin/remessas/${r.id}`}
                        className="px-4 py-1 bg-orange text-white font-semibold rounded hover:opacity-90 transition text-sm mt-1"
                      >
                        Ver detalhes
                      </Link>
                    </div>
                  </div>

                  {encomendasDaRemessa.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {encomendasDaRemessa.map((e) => (
                        <div
                          key={e.id}
                          className="flex items-center justify-between text-sm border border-orange rounded p-2"
                        >
                          <div>
                            <span className="font-bold">#{e.id}</span> –{" "}
                            {e.pacotes.length} pacote(s)
                          </div>
                          <div className="text-gray-600">
                            {e.pacotes
                              .reduce((s, p) => s + p.peso, 0)
                              .toFixed(2)}{" "}
                            kg
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end relative mt-4">
                    <button
                      className="px-4 py-2 bg-orange text-white rounded hover:bg-orange/80 text-sm"
                      onClick={() =>
                        setAcoesAbertas((prev) => (prev === r.id ? null : r.id))
                      }
                    >
                      Ações
                    </button>

                    {acoesAbertas === r.id && (
                      <div className="absolute right-0 mt-11 w-48 bg-white border border-gray-300 rounded shadow-md z-20">
                        <ul className="flex flex-col text-sm">
                          {r.status === "aberta" && r.pesoTotal >= 23 && (
                            <li>
                              <button
                                onClick={() => {
                                  fecharRemessa(r.id);
                                  setAcoesAbertas(null);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              >
                                Fechar Remessa
                              </button>
                            </li>
                          )}
                          {r.status === "fechada" && (
                            <li>
                              <button
                                onClick={() => {
                                  enviarRemessa(r.id);
                                  setAcoesAbertas(null);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              >
                                Enviar Remessa
                              </button>
                            </li>
                          )}
                          <li>
                            <Link
                              to={`/admin/remessas/${r.id}`}
                              className="block px-4 py-2 hover:bg-gray-100"
                              onClick={() => setAcoesAbertas(null)}
                            >
                              Ver Detalhes
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
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
