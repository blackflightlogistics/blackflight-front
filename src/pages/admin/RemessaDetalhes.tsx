import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { remessaService, Remessa } from "../../services/remessaService";
import { encomendaService, Encomenda } from "../../services/encomendaService";
import { clienteService, Cliente } from "../../services/clienteService";

const RemessaDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [remessa, setRemessa] = useState<Remessa | null>(null);
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      const r = await remessaService.buscarPorId(Number(id));
      const todasEncomendas = await encomendaService.listar();
      const todasClientes = await clienteService.listar();
      if (r) {
        const relacionadas = todasEncomendas.filter((e) => r.encomendaIds.includes(e.id));
        setRemessa(r);
        setEncomendas(relacionadas);
        setClientes(todasClientes);
      }
    };
    carregar();
  }, [id]);

  if (!remessa) {
    return <p className="p-6">Carregando detalhes da remessa...</p>;
  }

  return (
    <div className="h-screen overflow-hidden">
      <div className="md:fixed md:top-0 md:left-0 md:h-screen md:w-64 bg-white border-r z-10">
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded"
          onClick={() => setSidebarAberta(true)}
        >
          ☰ Menu
        </button>

        <Sidebar mobileAberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} />
      </div>

      <main className="md:ml-64 h-full overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Detalhes da Remessa</h1>
          <Link
            to="/admin/remessas"
            className="bg-orange hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
          >
            ← Voltar
          </Link>
        </div>

        <div className="bg-white border border-orange rounded-xl p-6 space-y-2 shadow-sm">
          <p><strong>País:</strong> {remessa.pais}</p>
          <p><strong>Status:</strong> {remessa.status}</p>
          <p><strong>Peso total:</strong> {remessa.pesoTotal.toFixed(2)} kg</p>
          <p><strong>Criada em:</strong> {new Date(remessa.dataCriacao).toLocaleDateString()}</p>
          {remessa.status === "enviada" && remessa.dataEnvio && (
            <p><strong>Enviada em:</strong> {new Date(remessa.dataEnvio).toLocaleDateString()}</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Encomendas da Remessa</h2>
          {encomendas.length === 0 ? (
            <p className="text-gray-600">Nenhuma encomenda vinculada.</p>
          ) : (
            <ul className="space-y-4">
              {encomendas.map((e) => {
                const remetente = clientes.find(c => c.id === e.remetenteId)?.nome || "Remetente não encontrado";
                const destinatario = clientes.find(c => c.id === e.destinatarioId)?.nome || "Destinatário não encontrado";

                return (
                  <li key={e.id} className="bg-white border border-orange rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Encomenda #{e.id}</p>
                        <p className="text-sm"><strong>De:</strong> {remetente}</p>
                        <p className="text-sm"><strong>Para:</strong> {destinatario}</p>
                        <p className="text-sm"><strong>Endereço de entrega:</strong> {`${e.enderecoEntrega.rua}, ${e.enderecoEntrega.numero} - ${e.enderecoEntrega.bairro}, ${e.enderecoEntrega.cidade} - ${e.enderecoEntrega.estado}, ${e.enderecoEntrega.cep}`}</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {e.pacotes.map((p) => (
                        <div key={p.id} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange rounded-full" />
                            <p className="font-bold text-sm">{p.descricao} - {p.peso}kg</p>
                          </div>
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default RemessaDetalhes;
