import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { remessaService, Shipment } from "../../services/remessaService";
import { orderService, Order } from "../../services/encomendaService";
// import { clienteService, Cliente } from "../../services/clienteService";

const RemessaDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [remessa, setRemessa] = useState<Shipment | null>(null);
  const [encomendas, setEncomendas] = useState<Order[]>([]);
  // const [clientes, setClientes] = useState<Cliente[]>([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(true); // ⬅️ novo estado de loading

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      const r = await remessaService.buscarPorId(id ?? "aqui ta indo default");
      const todasEncomendas = await orderService.listar();
      // const todasClientes = await clienteService.listar();
      if (r) {
        const relacionadas = todasEncomendas.filter((e) =>
          r.orders.map((o) => o.id).includes(e.id)
        );
        setRemessa(r);
        setEncomendas(relacionadas);
        // setClientes(todasClientes);
        setCarregando(false);
      }
    };
    carregar();
  }, [id]);

  // if (!remessa) {
  //   return <p className="p-6">Carregando detalhes da remessa...</p>;
  // }

  return (
    <div className="h-screen overflow-hidden">
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

      <main className="md:ml-64 h-full overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Detalhes da Remessa</h1>
          <Link
            to="/admin/remessas"
            className="bg-orange  text-white px-4 py-2 rounded text-sm transition"
          >
            ← Voltar
          </Link>
        </div>
        {carregando || !remessa ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="bg-white border border-orange rounded-xl p-6 space-y-2 shadow-sm">
              <p>
                <strong>País:</strong> {remessa.country}
              </p>
              <p>
                <strong>Status:</strong> {remessa.status ??"sem status"}
              </p>
              {/* <p><strong>Peso total:</strong> {remessa.pesoTotal.toFixed(2)} kg</p> */}
              <p>
                <strong>Peso total:</strong> aqui falta o peso total kg
              </p>
              <p>
                <strong>Criada em:</strong>{" "}
                {new Date(remessa.inserted_at).toLocaleDateString()}
              </p>
              {/* {remessa.status === "enviada" && remessa.dataEnvio && ( */}

              <p>
                <strong>Enviada em:</strong> aqui falta a data de envio
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Encomendas da Remessa</h2>
              {encomendas.length === 0 ? (
                <p className="text-gray-600">Nenhuma encomenda vinculada.</p>
              ) : (
                <ul className="space-y-4">
                  {encomendas.map((e) => {                  
                    return (
                      <li
                        key={e.id}
                        className="bg-white border border-orange rounded-xl p-6 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">Encomenda #{e.id}</p>
                            <p className="text-sm">
                              <strong>De:</strong> {e.from_account.name.toLowerCase()}
                            </p>
                            <p className="text-sm">
                              <strong>Para:</strong> {e.to_account.name.toLowerCase()}
                            </p>
                            {/* <p className="text-sm"><strong>Endereço de entrega:</strong> {`${e.enderecoEntrega.rua}, ${e.enderecoEntrega.numero} - ${e.enderecoEntrega.bairro}, ${e.enderecoEntrega.cidade} - ${e.enderecoEntrega.estado}, ${e.enderecoEntrega.cep}`}</p> */}
                            <p className="text-sm">
                              <strong>Endereço de entrega:</strong> {e.number}{" "}{e.street}{" "}{e.neighborhood}{" "}{e.city}{" "}{e.state}{" "}{e.country}{" "}{e.cep}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          {e.packages.map((p) => (
                            <div
                              key={p.id}
                              className="flex justify-between items-center"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange rounded-full" />
                                <p className="font-bold text-sm">
                                  {p.description} - {p.weight}kg
                                </p>
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
          </>
        )}
      </main>
    </div>
  );
};

export default RemessaDetalhes;
