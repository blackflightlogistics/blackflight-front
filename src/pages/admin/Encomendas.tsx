import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { Order, orderService } from "../../services/encomendaService";
import { pacoteStatusToString, paymentTypeToString } from "../../utils/utils";
import { useLanguage } from "../../context/useLanguage";

function Encomendas() {
  const { translations: t } = useLanguage();
  const [encomendas, setEncomendas] = useState<Order[]>([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      const [encomendasData] = await Promise.all([
        orderService.listar(),
      ]);
      setEncomendas(encomendasData);
      // setClientes(clientesData);
      setCarregando(false);
    };

    carregar();
  }, []);

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
        <div className="flex flex-col md:flex-row justify-between md:items-center items-start">
          <h1 className="text-2xl font-bold font-primary">{t.encomendas}</h1>
          <Link
            to="/admin/encomendas/nova"
            className="px-4 py-2 bg-orange text-white rounded-md font-secondary text-sm hover:opacity-90 transition"
          >
            {t.nova_encomenda}
          </Link>
        </div>

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
                {encomendas.map((e) => {
                  return (
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

                        <div className="text-right text-sm mt-4 md:mt-0">
                          <p>
                            <strong>{t.valor_total}</strong>{" "}
                            <span className="text-black font-bold">
                              $ {Number(e.total_value).toFixed(2)}
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
                              {paymentTypeToString(e?.payment_type ?? "",t) ??""}
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
                  );
                })}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Encomendas;
