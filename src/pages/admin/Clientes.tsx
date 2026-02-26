import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { clienteService, Cliente } from "../../services/clienteService";
import ClienteForm, {
  ClienteFormData,
} from "../../components/admin/ClienteForm";
import { formatarLinkWhatsapp } from "../../utils/formatarLinkWhatsapp";
import { useLanguage } from "../../context/useLanguage";
import CursorPagination from "../../components/admin/CursorPagination";
import { CursorInfo } from "../../types/pagination";

function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [cursorInfo, setCursorInfo] = useState<CursorInfo | null>(null);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [busca, setBusca] = useState("");
  const buscaInitialMount = useRef(true);
  const navigate = useNavigate();
  const { translations: t } = useLanguage();

  const carregarClientes = async (afterCursor?: string, search?: string) => {
    setCarregando(true);
    const filter = search?.trim() ? { search: search.trim() } : undefined;
    const resultado = await clienteService.listar(afterCursor, 10, filter);
    setClientes(resultado.data);
    setCursorInfo(resultado.cursor);
    setCarregando(false);
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  useEffect(() => {
    if (buscaInitialMount.current) {
      buscaInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setCursorHistory([]);
      carregarClientes(undefined, busca);
    }, 1000);
    return () => clearTimeout(timer);
  }, [busca]);

  const handleProximaPagina = () => {
    if (cursorInfo?.after) {
      setCursorHistory((prev) => [...prev, cursorInfo.after!]);
      carregarClientes(cursorInfo.after, busca);
    }
  };

  const handlePaginaAnterior = () => {
    const novoHistorico = [...cursorHistory];
    novoHistorico.pop();
    const cursorAnterior =
      novoHistorico.length > 0 ? novoHistorico[novoHistorico.length - 1] : undefined;
    setCursorHistory(novoHistorico);
    carregarClientes(cursorAnterior, busca);
  };

  const handleSalvarCliente = async (form: ClienteFormData) => {
    const endereco = {
      street: form.street,
      number: form.number,
      neighborhood: form.neighborhood,
      city: form.city,
      state: form.state,
      cep: form.cep,
      country: form.country,
    };

    await clienteService.adicionar({
      name: form.name,
      last_name: form.last_name,
      phone_number: form.phone_number,
      email: form.email,
      adresses: [endereco],
      removed_adresses: [],
    });

    setFormVisible(false);
    carregarClientes(undefined, busca);
  };

  return (
    <div className="flex min-h-screen">
      <div className="md:top-0 md:left-0 md:h-screen md:w-64 bg-black text-white border-r z-10">
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

      <div className="flex-1 flex flex-col min-h-0 h-screen overflow-y-auto overflow-x-hidden bg-[#fcf7f1] pt-16 p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 shrink-0">
          <h1 className="text-2xl font-bold font-primary">{t.client_title}</h1>
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder={t.buscar}
              className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent min-w-[200px] sm:min-w-[280px]"
            />
            <button
              onClick={() => setFormVisible(!formVisible)}
              className="h-10 px-4 py-2 rounded-md bg-orange text-white hover:opacity-90 font-secondary text-sm whitespace-nowrap"
            >
              {formVisible ? t.cancelar : t.novo_cliente}
            </button>
          </div>
        </div>

        {formVisible && (
          <ClienteForm
            onSubmit={handleSalvarCliente}
            onCancel={() => setFormVisible(false)}
          />
        )}

        {carregando ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
          </div>
        ) : clientes.length === 0 ? (
          <p className="text-gray-600">{t.nenhum_cliente}</p>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col bg-white rounded-md border border-orange overflow-hidden">
            <div className="flex-1 min-h-0 overflow-auto">
              <table className="w-full text-sm font-secondary min-w-[700px]">
                <thead>
                  <tr className="bg-orange text-white">
                    <th className="text-left py-3 px-4 font-semibold">{t.nome}</th>
                    <th className="text-left py-3 px-4 font-semibold">{t.contato}</th>
                    <th className="text-left py-3 px-4 font-semibold">E-mail</th>
                    <th className="text-left py-3 px-4 font-semibold">{t.enderecos}</th>
                    <th className="text-right py-3 px-4 font-semibold w-24">{t.editar}</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2.5 px-4">
                        {cliente.name} {cliente.last_name}
                      </td>
                      <td className="py-2.5 px-4">
                        {formatarLinkWhatsapp(cliente.phone_number, true, {
                          icon: true,
                        })}
                      </td>
                      <td className="py-2.5 px-4">{cliente.email}</td>
                      <td className="py-2.5 px-4 max-w-[200px]">
                        {cliente.adresses.length === 0 ? (
                          <span className="text-gray-500">{t.nenhum_endereco}</span>
                        ) : (
                          <span className="line-clamp-2" title={cliente.adresses.map((e) => `${e.number} ${e.street}, ${e.neighborhood}, ${e.city} - ${e.state}`).join(" | ")}>
                            {cliente.adresses.map((endereco, idx) => (
                              <span key={idx}>
                                {idx > 0 && " · "}
                                {endereco.number} {endereco.street}, {endereco.city}
                              </span>
                            ))}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() =>
                            navigate(`/admin/clientes/${cliente.id}/editar`)
                          }
                          className="bg-orange text-white px-3 py-1.5 rounded hover:opacity-90 font-secondary text-xs whitespace-nowrap"
                        >
                          {t.editar}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CursorPagination
              onNext={handleProximaPagina}
              onPrev={handlePaginaAnterior}
              hasNext={!!cursorInfo?.after}
              hasPrev={cursorHistory.length > 0}
              loading={carregando}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Clientes;
