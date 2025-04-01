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
    <div className="flex">
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded"
        onClick={() => setSidebarAberta(true)}
      >
        ☰ Menu
      </button>

      <Sidebar mobileAberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Detalhes da Remessa #{remessa.id}</h1>
          <Link to="/admin/remessas" className="text-blue-600 hover:underline">
            ← Voltar
          </Link>
        </div>

        <div className="p-4 border rounded bg-white shadow-sm">
          <p><strong>País:</strong> {remessa.pais}</p>
          <p><strong>Status:</strong> {remessa.status}</p>
          <p><strong>Peso total:</strong> {remessa.pesoTotal.toFixed(2)} kg</p>
          <p><strong>Criada em:</strong> {new Date(remessa.dataCriacao).toLocaleDateString()}</p>
          {remessa.status === "enviada" && remessa.dataEnvio && (
            <p><strong>Enviada em:</strong> {new Date(remessa.dataEnvio).toLocaleDateString()}</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-4 mb-2">Encomendas</h2>
          {encomendas.length === 0 ? (
            <p className="text-gray-600">Nenhuma encomenda vinculada.</p>
          ) : (
            <ul className="space-y-4">
              {encomendas.map((e) => {
                const remetente = clientes.find(c => c.id === e.remetenteId)?.nome || "Remetente não encontrado";
                const destinatario = clientes.find(c => c.id === e.destinatarioId)?.nome || "Destinatário não encontrado";
                return (
                  <li key={e.id} className="p-4 bg-white border rounded shadow-sm">
                    <p><strong>Encomenda #{e.id}</strong></p>
                    <p><strong>De:</strong> {remetente}</p>
                    <p><strong>Para:</strong> {destinatario}</p>
                    <p><strong>Endereço de entrega:</strong> {`${e.enderecoEntrega.rua}, ${e.enderecoEntrega.numero} - ${e.enderecoEntrega.bairro}, ${e.enderecoEntrega.cidade} - ${e.enderecoEntrega.estado}, ${e.enderecoEntrega.cep}`}</p>
                    <p className="mt-2 font-medium">Pacotes:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {e.pacotes.map(p => (
                        <li key={p.id}>
                          {p.descricao} - {p.peso} kg ({p.status})
                        </li>
                      ))}
                    </ul>
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
