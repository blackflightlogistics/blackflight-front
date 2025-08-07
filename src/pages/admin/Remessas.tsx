import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { remessaService, Shipment } from "../../services/remessaService";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/useLanguage";
import { pacoteStatusToString, remessaStatusToString } from "../../utils/utils";

const Remessas = () => {
  const { translations: t } = useLanguage();
  const [remessas, setRemessas] = useState<Shipment[]>([]);
  const [statusFiltro, setStatusFiltro] = useState<string>("todos");
  const [buscaPais, setBuscaPais] = useState<string>("");
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [acoesAbertas, setAcoesAbertas] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [imprimindo, setImprimindo] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      const remessasData = await remessaService.listar();
      setRemessas(remessasData);
      setCarregando(false);
    };

    carregar();
  }, []);

  const fecharRemessa = async (id: string) => {
    console.log("Remessa fechada:", id);
  };

  const enviarRemessa = async (id: string) => {
    console.log("Remessa enviada:", id);
    fecharRemessa(id);
  };

  const imprimirListagem = async () => {
    setImprimindo(true);
    
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        setImprimindo(false);
        return;
      }

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Listagem de Remessas - Black Flight Logistic</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #ff6b35;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #ff6b35;
              margin: 0;
            }
            .remessa {
              margin-bottom: 40px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 8px;
              break-inside: avoid;
            }
            .remessa-header {
              background-color: #f5f5f5;
              padding: 10px;
              border-radius: 5px;
              margin-bottom: 15px;
              border-left: 4px solid #ff6b35;
            }
            .encomenda {
              margin-bottom: 25px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 8px;
              break-inside: avoid;
            }
            .info-section h3 {
              color: #ff6b35;
              margin: 0 0 10px 0;
              font-size: 14px;
            }
            .info-item {
              margin-bottom: 5px;
              font-size: 12px;
            }
            .info-item strong {
              color: #333;
            }
            .pacotes {
              margin-top: 15px;
            }
            .pacote {
              background: #f8f9fa;
              padding: 8px;
              margin: 5px 0;
              border-radius: 4px;
              font-size: 12px;
            }
            .status {
              background: #e3f2fd;
              color: #1976d2;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 10px;
              display: inline-block;
            }
            @media print {
              body { margin: 0; }
              .remessa { break-inside: avoid; page-break-after: always; }
              .encomenda { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Black Flight Logistic</h1>
            <h2>Listagem de Remessas</h2>
            <p>Data: ${new Date().toLocaleDateString("pt-BR")}</p>
            <p>Total de remessas: ${remessas.length}</p>
          </div>
          
          ${remessas
            .map(
              (r) => `
            <div class="remessa">
              <div class="remessa-header">
                <h2>${r.country}</h2>
                <p><strong>Status:</strong> ${r.status || ""}</p>
                <p><strong>Data de Criação:</strong> ${new Date(r.inserted_at).toLocaleDateString()}</p>
                <p><strong>Peso Total:</strong> ${r.total_weight || "0"} kg</p>
              </div>
              
              ${r.orders
                .map(
                  (e) => `
                <div class="encomenda">
                  <div class="info-section">
                    <h3>Informações da Encomenda</h3>
                    <div class="info-item"><strong>De:</strong> ${e.from_account?.name || ""}</div>
                    <div class="info-item"><strong>Para:</strong> ${e.to_account?.name || ""}</div>
                    <div class="info-item"><strong>Tracking Code:</strong> ${e.tracking_code || ""}</div>
                    <div class="info-item"><strong>Status:</strong> <span class="status">${pacoteStatusToString(
                      e?.status ?? "",
                      t
                    )}</span></div>
                  </div>
                  
                  <div class="pacotes">
                    <h3>Pacotes</h3>
                    ${e.packages
                      .map(
                        (p) => `
                      <div class="pacote">
                        📦 ${p.description || ""} - ${Number(p.weight || 0)} kg 
                        <span class="status">${pacoteStatusToString(
                          p.status || "",
                          t
                        )}</span>
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
            )
            .join("")}
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Aguardar um pouco para garantir que as imagens carregaram antes de imprimir
      setTimeout(() => {
        printWindow.print();
        setImprimindo(false);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao imprimir:', error);
      alert('Erro ao preparar impressão. Tente novamente.');
      setImprimindo(false);
    }
  };

  const remessasFiltradas = remessas.filter((r) => {
    const statusOk = statusFiltro === "todos" || r.status === statusFiltro;
    const paisOk = r.country.toLowerCase().includes(buscaPais.toLowerCase());
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
      <div className="md:fixed md:top-0 md:left-0 md:h-screen md:w-64 bg-black text-white z-10">
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded"
          onClick={() => setSidebarAberta(true)}
        >
          ☰ {t.menu}
        </button>
        <Sidebar
          mobileAberta={sidebarAberta}
          onFechar={() => setSidebarAberta(false)}
        />
      </div>

      <main className="md:ml-64 h-full overflow-y-auto bg-[#fcf8f5] pt-16 p-4 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold font-primary text-black">
            {t.sidebar_remessas}
          </h1>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={imprimirListagem}
              disabled={remessas.length === 0 || imprimindo}
              className="px-4 py-2 bg-orange text-white font-semibold rounded hover:opacity-90 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {imprimindo ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Preparando...
                </>
              ) : (
                <>🖨️ {t.etiqueta_imprimir}</>
              )}
            </button>
            
            <Link
              to="/admin/remessas/nova"
              className="px-4 py-2 bg-orange text-white font-semibold rounded hover:opacity-90 transition text-sm"
            >
              {t.remessa_manual_titulo}
            </Link>

            <select
              className="border border-gray-300 bg-white p-2 rounded text-sm"
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
            >
              <option value="todos">{t.selecionar_todos}</option>
              <option value="aberta">{t.status_em_preparacao}</option>
              <option value="fechada">{t.status_aguardando_retirada}</option>
              <option value="enviada">{t.status_entregue}</option>
            </select>

            <input
              type="text"
              placeholder={t.pais}
              className="border border-gray-300 bg-white p-2 rounded text-sm"
              value={buscaPais}
              onChange={(e) => setBuscaPais(e.target.value)}
            />
          </div>
        </div>
        {carregando ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
          </div>
        ) : remessasFiltradas.length === 0 ? (
          <p className="text-gray-600">{t.nenhuma_encomenda}</p>
        ) : (
          <ul className="space-y-4">
            {remessasFiltradas.map((r) => {
              const encomendasDaRemessa = r.orders;
              return (
                <li
                  key={r.id}
                  className="bg-white p-6 rounded-xl border border-orange"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {renderStatusIcone(r.status ?? "aberta default")}
                        <p className="text-lg font-semibold text-black">
                          {r.country}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Status: <strong>{remessaStatusToString(r.status ?? "aberta", t)}</strong>
                      </p>
                      <p className="text-sm text-gray-600">
                        {t.etiqueta_data_geracao}:{" "}
                        {new Date(r.inserted_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Peso Atual</p>
                        {/* <p
                          className={`text-xl font-bold ${
                            r.pesoTotal >= 23
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {r.pesoTotal.toFixed(2)} kg
                        </p> */}
                       {r.total_weight}
                      </div>

                      <Link
                        to={`/admin/remessas/${r.id}`}
                        className="px-4 py-1 bg-orange text-white font-semibold rounded hover:opacity-90 transition text-sm mt-1"
                      >
                        {t.detalhes}
                      </Link>
                    </div>
                  </div>

                  {encomendasDaRemessa.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {encomendasDaRemessa.map((e) => (
                        <div>
                          <strong>{t.encomendas}</strong>
                          <div
                            key={e.id}
                            className="items-center justify-between text-sm border border-orange rounded p-2"
                          >
                            <div>
                              <p className="text-sm text-gray-600">
                                {t.pais}: <strong>{r.country}</strong>
                              </p>
                              <p className="text-sm text-gray-600">
                                {t.remetente}:{" "}
                                <strong>
                                  {e?.from_account?.name?.toLocaleLowerCase()}
                                </strong>
                              </p>
                              <p className="text-sm text-gray-600">
                                {t.destinatario}:{" "}
                                <strong>
                                  {e.to_account.name?.toLocaleLowerCase()}
                                </strong>
                              </p>
                              <p className="text-sm text-gray-600">
                                {t.tracking_code}:{" "}
                                <strong>{e.tracking_code}</strong>
                              </p>
                              <p className="flex">
                                <span className="font-bold">#</span> –{" "}
                                {e.packages.length} {t.pacotes}(s) –{" "}
                                {e.packages
                                  .reduce((s, p) => s + Number(p.weight), 0)
                                  .toFixed(2)}{" "}
                                kg
                              </p>
                            </div>
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
                      {t.mais_opcoes}
                    </button>

                    {acoesAbertas === r.id && (
                      <div className="absolute right-0 mt-11 w-48 bg-white border border-gray-300 rounded shadow-md z-20">
                        <ul className="flex flex-col text-sm">
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
                              className="block px-2 py-1 bg-orange text-white text-center font-semibold rounded hover:opacity-90 transition text-sm m-1"
                              onClick={() => setAcoesAbertas(null)}
                            >
                              Cancelar Remessa
                            </Link>
                            <Link
                              to={`/admin/remessas/${r.id}/etiquetas`}
                              className="block px-2 py-1 bg-orange text-white text-center font-semibold rounded hover:opacity-90 transition text-sm m-1"
                              onClick={() => setAcoesAbertas(null)}
                            >
                              {t.gerar_etiquetas}
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
