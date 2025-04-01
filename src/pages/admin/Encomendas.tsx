import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { Encomenda, encomendaService } from "../../services/encomendaService";
import { clienteService, Cliente } from "../../services/clienteService";

function Encomendas() {
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    encomendaService.listar().then(setEncomendas);
    clienteService.listar().then(setClientes);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Encomendas</h1>
          <Link
            to="/admin/encomendas/nova"
            className="px-4 py-2 bg-black text-white rounded hover:opacity-80"
          >
            Nova Encomenda
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
                <li key={e.id} className="p-4 bg-white rounded shadow relative">
                  <p>
                    <strong>De:</strong> {remetente} <strong>Para:</strong>{" "}
                    {destinatario}
                  </p>
                  <p>
                    <strong>Status:</strong> {e.status}
                  </p>
                  {e.formaPagamento && (
                    <p>
                      <strong>Forma de pagamento:</strong> {e.formaPagamento}
                    </p>
                  )}
                  {e.statusPagamento && (
                    <>
                      <p>
                        <strong>Status de pagamento:</strong>{" "}
                        <span
                          className={
                            e.statusPagamento === "pago"
                              ? "text-green-600"
                              : e.statusPagamento === "parcial"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }
                        >
                          {e.statusPagamento}
                        </span>
                      </p>

                      {e.statusPagamento === "parcial" &&
                        e.valorPago !== undefined && (
                          <p>
                            <strong>Valor já pago:</strong>{" "}
                            <span className="text-blue-700">
                              R$ {e.valorPago.toFixed(2)}
                            </span>
                          </p>
                        )}
                    </>
                  )}

                  <p>
                    <strong>Valor total:</strong>{" "}
                    <span className="text-green-700">
                      R$ {e.valorTotal?.toFixed(2) || "0,00"}
                    </span>
                  </p>
                  <p>
                    <strong>Endereço:</strong> {e.enderecoEntrega.rua},{" "}
                    {e.enderecoEntrega.numero} - {e.enderecoEntrega.bairro},{" "}
                    {e.enderecoEntrega.cidade} - {e.enderecoEntrega.estado},{" "}
                    {e.enderecoEntrega.cep}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {e.pacotes.map((p) => (
                      <li key={p.id} className="text-sm">
                        📦 <strong>{p.descricao}</strong> - {p.peso}kg (
                        {p.status})
                      </li>
                    ))}
                  </ul>

                  {/* Botão para pagamento */}
                  <Link
                    to={`/admin/encomendas/${e.id}/pagamento`}
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 transition"
                  >
                    Ir para pagamento
                  </Link>
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
