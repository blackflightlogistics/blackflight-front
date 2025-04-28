import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { Encomenda, encomendaService } from "../../services/encomendaService";
import { clienteService, Cliente } from "../../services/clienteService";

function Encomendas() {
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);

  useEffect(() => {
    encomendaService.listar().then(setEncomendas);
    clienteService.listar().then(setClientes);
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
      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto p-6 space-y-6 bg-[#FAF7F2]">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold font-primary">Encomendas</h1>
          <Link
            to="/admin/encomendas/nova"
            className="px-4 py-2 bg-orange text-white rounded-md font-secondary text-sm hover:opacity-90 transition"
          >
            Nova encomenda
          </Link>
        </div>

        {encomendas.length === 0 ? (
          <p className="text-gray-600">Nenhuma encomenda cadastrada.</p>
        ) : (
          <ul className="space-y-4">
            {encomendas.map((e) => {
              const remetente =
                clientes.find((c) => c.id === e.remetenteId)?.nome || "—";
              const destinatario =
                clientes.find((c) => c.id === e.destinatarioId)?.nome || "—";

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
                        <strong>Endereço:</strong> {e.enderecoEntrega.rua},{" "}
                        {e.enderecoEntrega.numero} - {e.enderecoEntrega.bairro},{" "}
                        {e.enderecoEntrega.cidade} - {e.enderecoEntrega.estado},{" "}
                        {e.enderecoEntrega.cep}
                      </p>
                    </div>

                    <div className="text-right text-sm mt-4 md:mt-0">
                      <p>
                        <strong>Valor total:</strong>{" "}
                        <span className="text-black font-bold">
                          R$ {e.valorTotal?.toFixed(2)}
                        </span>
                      </p>
                      <p>
                        <strong>Status de pagamento:</strong>{" "}
                        <span className="text-black">{e.statusPagamento}</span>
                      </p>
                      <p>
                        <strong>Forma de pagamento:</strong> {e.formaPagamento}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {e.pacotes.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between gap-4 text-sm max-w-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange rounded-full" />
                          <p className="font-bold">
                            {p.descricao} - {p.peso}kg
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {e.statusPagamento !== "pago" && (
                    <div className="mt-4">
                      <Link
                        to={`/admin/encomendas/${e.id}/pagamento`}
                        className="inline-block bg-orange text-white font-secondary text-sm px-4 py-2 rounded-md hover:opacity-90 transition"
                      >
                        Ir para pagamento
                      </Link>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}

export default Encomendas;
