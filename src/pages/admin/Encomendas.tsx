import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { Order, orderService } from "../../services/encomendaService";
import { Cliente, clienteService } from "../../services/clienteService";
import { pacoteStatusToString } from "../../utils/utils";

function Encomendas() {
  const [encomendas, setEncomendas] = useState<Order[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(true); // ⬅️ novo estado de loading

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      const [encomendasData, clientesData] = await Promise.all([
        orderService.listar(),
        clienteService.listar(),
      ]);
      setEncomendas(encomendasData);
      setClientes(clientesData);
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
          ☰ Menu
        </button>
        <Sidebar
          mobileAberta={sidebarAberta}
          onFechar={() => setSidebarAberta(false)}
        />
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto p-6 pt-16 space-y-6 bg-[#FAF7F2]">
        <div className="flex flex-col md:flex-row justify-between md:items-center items-start">
          <h1 className="text-2xl font-bold font-primary">Encomendas</h1>
          <Link
            to="/admin/encomendas/nova"
            className="px-4 py-2 bg-orange text-white rounded-md font-secondary text-sm hover:opacity-90 transition"
          >
            Nova encomenda
          </Link>
        </div>

        {/* Loading */}
        {carregando ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
          </div>
        ) : (
          <>
            {encomendas.length === 0 ? (
              <p className="text-gray-600">Nenhuma encomenda cadastrada.</p>
            ) : (
              <ul className="space-y-4">
                {encomendas.map((e) => {
                  const remetente =
                    clientes.find((c) => c.id === e.from_account_id)?.name ||
                    "—";
                  const destinatario =
                    clientes.find((c) => c.id === e.to_account_id)?.name || "—";

                  return (
                    <li
                      key={e.id}
                      className="p-6 bg-[#FDFBF9] rounded-md border border-orange space-y-2 relative"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between">
                        <div className="space-y-1 text-sm text-black">
                          <p>
                            <strong>De:</strong> {remetente}
                          </p>
                          <p>
                            <strong>Para:</strong> {destinatario}
                          </p>
                          <p>
                            <strong>Endereço: </strong>
                            {e.number} - {e.street} - {e.neighborhood} -{e.city}{" "}
                            - {e.state} -{e.country} - {e.cep} <br />
                          </p>
                        </div>

                        <div className="text-right text-sm mt-4 md:mt-0">
                          <p>
                            <strong>Valor total:</strong>{" "}
                            <span className="text-black font-bold">
                              $ {e.total_value}
                            </span>
                          </p>
                          <p>
                            <strong>Status de pagamento:</strong>{" "}
                            <span className="text-black">
                              {e.payment_type !== "" && e.payment_type !== null
                                ? e.payment_type
                                : "Em aberto"}
                            </span>
                          </p>
                          <p>
                            {/* <strong>Forma de pagamento:</strong> {e.formaPagamento} */}
                            <strong>Forma de pagamento: </strong>
                            <span className="text-black">
                              {e.payment_type !== "" && e.payment_type !== null
                                ? e.payment_type
                                : "Em aberto"}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Pacotes */}
                      <div className="flex flex-col md:flex-row md:justify-between ">
                        <div className="mt-4 space-y-2 ">
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
                                {pacoteStatusToString(p.status)}
                              </span>
                              <div className="text-right text-sm mt-4 md:mt-0"></div>
                            </div>
                          ))}
                        </div>
                        <Link
                          to={`/admin/encomendas/${e.id}/pagamento`}
                          className="text-center mt-4 md:mt-0 md:absolute top-30 right-4 px-4 py-2 bg-orange text-white rounded-md font-secondary text-sm hover:opacity-90 transition"
                        >
                          Detalhes
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
