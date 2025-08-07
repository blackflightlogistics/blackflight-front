import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import OrderFiltersComponent from "../../components/admin/OrderFilters";
import { Order, orderService, OrderFilters } from "../../services/encomendaService";
import { pacoteStatusToString, paymentTypeToString } from "../../utils/utils";
import { useLanguage } from "../../context/useLanguage";
import { gerarQrBase64PNG } from "../../components/shared/QRCodeComLogo";

function Encomendas() {
  const { translations: t } = useLanguage();
  const [encomendas, setEncomendas] = useState<Order[]>([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [qrCodeCache, setQrCodeCache] = useState<Record<string, string>>({});
  const [gerandoQRCodes, setGerandoQRCodes] = useState(false);
  const [imprimindo, setImprimindo] = useState(false);
  const [filtros, setFiltros] = useState<OrderFilters>({});

  const carregar = async (filtrosAplicados?: OrderFilters) => {
    setCarregando(true);
    const [encomendasData] = await Promise.all([orderService.listar(false, filtrosAplicados)]);
    setEncomendas(encomendasData);
    setCarregando(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const aplicarFiltros = () => {
    const filtrosFormatados: OrderFilters = { ...filtros };
    
    // Converter datas para formato ISO 8601 com timezone UTC
    if (filtros.initial_date) {
      const dataInicial = new Date(filtros.initial_date);
      dataInicial.setUTCHours(0, 0, 0, 0); // Início do dia
      filtrosFormatados.initial_date = dataInicial.toISOString();
    }
    
    if (filtros.final_date) {
      const dataFinal = new Date(filtros.final_date);
      dataFinal.setUTCHours(23, 59, 59, 999); // Final do dia
      filtrosFormatados.final_date = dataFinal.toISOString();
    }
    
    carregar(filtrosFormatados);
  };

  const limparFiltros = () => {
    setFiltros({});
    carregar();
  };

  useEffect(() => {
    const gerarQrCodes = async () => {
      if (encomendas.length === 0) return;
      
      setGerandoQRCodes(true);
      
      try {
        // Gerar QR codes um por vez para evitar sobrecarga
        const qrCache: Record<string, string> = {};
        
        for (const e of encomendas) {
          try {
            const qrCode = await gerarQrBase64PNG(`E-${e.id}`);
            qrCache[e.id] = qrCode;
            
            // Atualizar o cache incrementalmente para feedback visual
            setQrCodeCache(prev => ({ ...prev, [e.id]: qrCode }));
          } catch (error) {
            console.error(`Erro ao gerar QR code para encomenda ${e.id}:`, error);
          }
        }
      } catch (error) {
        console.error('Erro geral ao gerar QR codes:', error);
      } finally {
        setGerandoQRCodes(false);
      }
    };

    gerarQrCodes();
  }, [encomendas]);

  const imprimirListagem = async () => {
    setImprimindo(true);
    
    try {
      // Garantir que todos os QR codes estejam gerados
      let qrCodesCompletos = qrCodeCache;
      
      // Se ainda estão sendo gerados ou alguns estão faltando, gerar todos novamente
      if (gerandoQRCodes || Object.keys(qrCodeCache).length < encomendas.length) {
        const qrPromises = encomendas.map(async (e) => {
          if (qrCodeCache[e.id]) {
            return { id: e.id, qrCode: qrCodeCache[e.id] };
          }
          const qrCode = await gerarQrBase64PNG(`E-${e.id}`);
          return { id: e.id, qrCode };
        });

        const qrResults = await Promise.all(qrPromises);
        qrCodesCompletos = {};
        
        qrResults.forEach(({ id, qrCode }) => {
          qrCodesCompletos[id] = qrCode;
        });
        
        // Atualizar o cache principal também
        setQrCodeCache(qrCodesCompletos);
      }

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        setImprimindo(false);
        return;
      }

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Listagem de Encomendas - Black Flight Logistic</title>
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
            .encomenda {
              margin-bottom: 25px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 8px;
              break-inside: avoid;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr auto 1fr;
              gap: 20px;
              margin-bottom: 15px;
              align-items: start;
            }
            .qr-section {
              text-align: center;
              padding: 10px;
            }
            .qr-section img {
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            .qr-section p {
              margin: 5px 0 0 0;
              font-size: 12px;
              font-weight: bold;
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
              .encomenda { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Black Flight Logistic</h1>
            <h2>Listagem de Encomendas</h2>
            <p>Data: ${new Date().toLocaleDateString("pt-BR")}</p>
            <p>Total de encomendas: ${encomendas.length}</p>
          </div>
          
          ${encomendas
            .map(
              (e) => `
            <div class="encomenda">
              <div class="info-grid">
                <div class="info-section">
                  <h3>Informações da Encomenda</h3>
                  <div class="info-item"><strong>De:</strong> ${
                    e.from_account.name
                  }</div>
                  <div class="info-item"><strong>Para:</strong> ${
                    e.to_account.name
                  }</div>
                  <div class="info-item"><strong>Endereço:</strong> ${
                    e.number
                  } - ${e.street} - ${e.neighborhood} - ${e.city} - ${
                e.state
              } - ${e.country} - ${e.cep}</div>
                </div>
                
                <div class="qr-section">
                  ${qrCodesCompletos[e.id] ? `
                    <img src="${qrCodesCompletos[e.id]}" width="120" height="120" alt="QR Code" />
                    <p>ID: E-${e.id.split("-")[0]}</p>
                  ` : `
                    <div style="width: 120px; height: 120px; background: #f0f0f0; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; border-radius: 4px;">
                      <span style="font-size: 12px; color: #666;">QR Code</span>
                    </div>
                    <p>ID: E-${e.id.split("-")[0]}</p>
                  `}
                </div>
                
                <div class="info-section">
                  <h3>Detalhes Financeiros</h3>
                  <div class="info-item"><strong>Valor Total:</strong> € ${Number(
                    e.total_value
                  ).toFixed(2)}</div>
                  <div class="info-item"><strong>Status:</strong> <span class="status">${pacoteStatusToString(
                    e?.status ?? "",
                    t
                  )}</span></div>
                  <div class="info-item"><strong>Pagamento:</strong> ${
                    e.payment_status || t.em_aberto
                  }</div>
                  <div class="info-item"><strong>Forma de Pagamento:</strong> ${
                    paymentTypeToString(e?.payment_type ?? "", t) || ""
                  }</div>
                </div>
              </div>
              
              <div class="pacotes">
                <h3>Pacotes</h3>
                ${e.packages
                  .map(
                    (p) => `
                  <div class="pacote">
                    📦 ${p.description} - ${Number(p.weight)} kg 
                    <span class="status">${pacoteStatusToString(
                      p.status,
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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fixa */}
      <div className="fixed top-0 left-0 h-screen md:w-64 bg-black text-white border-r z-10">
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

      {/* Conteúdo principal */}
      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto p-6 pt-16 space-y-6 bg-[#FAF7F2]">
        <div className="flex flex-col md:flex-row justify-between md:items-center items-start gap-4">
          <h1 className="text-2xl font-bold font-primary">{t.encomendas}</h1>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={imprimirListagem}
              disabled={encomendas.length === 0 || imprimindo}
              className="px-4 py-2 bg-orange text-white rounded-md font-secondary text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              to="/admin/encomendas/nova"
              className="px-4 py-2 bg-orange text-white rounded-md font-secondary text-sm hover:opacity-90 transition text-center"
            >
              {t.nova_encomenda}
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <OrderFiltersComponent
          filtros={filtros}
          onFiltrosChange={setFiltros}
          onAplicarFiltros={aplicarFiltros}
          onLimparFiltros={limparFiltros}
        />

        {(gerandoQRCodes || imprimindo) && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-blue-700 text-sm">
                {imprimindo 
                  ? "Preparando impressão com QR codes..." 
                  : `Gerando QR codes... (${Object.keys(qrCodeCache).length}/${encomendas.length})`
                }
              </span>
            </div>
          </div>
        )}

        {carregando ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
          </div>
        ) : (
          <>
            {encomendas.length === 0 ? (
              <p className="text-gray-600">{t.nenhuma_encomenda}</p>
            ) : (
              <ul className="space-y-4">
                {encomendas.map((e) => (
                  <li
                    key={e.id}
                    className="p-6 bg-[#FDFBF9] rounded-md border border-orange space-y-2 relative"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div className="space-y-1 text-sm text-black">
                        <p>
                          <strong>{t.de}</strong>{" "}
                          {e.from_account.name.toLocaleLowerCase()}
                        </p>
                        <p>
                          <strong>{t.para}</strong>{" "}
                          {e.to_account.name.toLocaleLowerCase()}
                        </p>
                        <p>
                          <strong>{t.endereco}</strong> {e.number} -{" "}
                          {e.street} - {e.neighborhood} - {e.city} - {e.state}{" "}
                          - {e.country} - {e.cep}
                        </p>
                      </div>
                      <div>
                        <div className="flex flex-col items-center">
                          {qrCodeCache[e.id] ? (
                            <img
                              src={qrCodeCache[e.id]}
                              width={120}
                              height={120}
                              alt="QR Code"
                              className="border border-gray-300 rounded"
                            />
                          ) : (
                            <div className="w-[120px] h-[120px] bg-gray-200 border border-gray-300 rounded flex items-center justify-center">
                              {gerandoQRCodes ? (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange border-t-transparent"></div>
                                  <span className="text-xs text-gray-500">Gerando...</span>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">QR Code</span>
                              )}
                            </div>
                          )}
                          <p className="text-xs mt-1 font-medium">ID: E-{e?.id.split("-")[0]}</p>
                        </div>
                      </div>

                      <div className="text-right text-sm mt-4 md:mt-0">
                        <p>
                          <strong>{t.valor_total}</strong>{" "}
                          <span className="text-black font-bold">
                            € {Number(e.total_value).toFixed(2)}
                          </span>
                        </p>
                        <p>
                          <strong>{t.status_encomenda}:</strong>{" "}
                          <span className="text-black">
                            {pacoteStatusToString(e?.status ?? "", t)}
                          </span>
                        </p>
                        <p>
                          <strong>{t.status_pagamento}</strong>{" "}
                          <span className="text-black">
                            {e.payment_status || t.em_aberto}
                          </span>
                        </p>
                        <p>
                          <strong>{t.forma_pagamento}</strong>{" "}
                          <span className="text-black">
                            {paymentTypeToString(e?.payment_type ?? "", t) ??
                              ""}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Pacotes */}
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div className="mt-4 space-y-2">
                        {e.packages.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between gap-4 text-sm max-w-sm"
                          >
                            <div className="flex items-center gap-2 w-full">
                              <div className="w-3 h-3 bg-orange rounded-full" />
                              <p className="font-bold">
                                {p.description} - {Number(p.weight)} kg
                              </p>
                            </div>
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                              {pacoteStatusToString(p.status, t)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Link
                        to={`/admin/encomendas/${e.id}/pagamento`}
                        className="text-center mt-4 md:mt-0 md:absolute top-30 right-4 px-4 py-2 bg-orange text-white rounded-md font-secondary text-sm hover:opacity-90 transition"
                      >
                        {t.detalhes}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Encomendas;