import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { clienteService, Cliente } from "../../services/clienteService";
import { configService } from "../../services/configService";
import ClienteSelect from "../../components/admin/ClienteSelect";
import dayjs from "dayjs";
import { orderService } from "../../services/encomendaService";
import ClienteForm from "../../components/admin/ClienteForm";

function NovaEncomenda() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [, setEndereco] = useState({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });
  type PacoteStatus =
    | "em preparação"
    | "em transito"
    | "aguardando retirada"
    | "entregue"
    | "cancelada";
  const [loadingTela, setLoadingTela] = useState(true);
  const [statusPacote, setStatusPacote] =
    useState<PacoteStatus>("em preparação");

  const [remetenteId, setRemetenteId] = useState<string>("");
  const [destinatarioId, setDestinatarioId] = useState<string>("");

  const [descricaoPacote, setDescricaoPacote] = useState("");
  const [pesoPacote, setPesoPacote] = useState("");
  const [valorDeclaradoPacote, setValorDeclaradoPacote] = useState("");
  const [pacotes, setPacotes] = useState<
    {
      description: string;
      weight: string;
      status: string;
      declared_value: string;
    }[]
  >([]);

  const [encomendaExpressa, setEncomendaExpressa] = useState(false);
  const [dataEnvioExpressa, setDataEnvioExpressa] = useState("");
  const [adicionalExpresso, setAdicionalExpresso] = useState<number>(0);

  const [showRemetenteForm, setShowRemetenteForm] = useState(false);
  const [showDestinatarioForm, setShowDestinatarioForm] = useState(false);

  const [loadingSalvar, setLoadingSalvar] = useState(false);
  const [loadingPagamento, setLoadingPagamento] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      setLoadingTela(true);
      await clienteService.listar().then(setClientes);
      await configService.buscar().then((conf) => {
        setAdicionalExpresso(Number(conf.expressAmount) || 0);
      });
      setLoadingTela(false);
    }
    carregarDados();
  }, []);

  const adicionarPacote = () => {
    if (!descricaoPacote || !pesoPacote) return;

    const novoPacote = {
      description: descricaoPacote,
      weight: pesoPacote,
      status: "waiting",
      declared_value: valorDeclaradoPacote || "0",
    };

    setPacotes([...pacotes, novoPacote]);
    setDescricaoPacote("");
    setPesoPacote("");
    setValorDeclaradoPacote("");
  };

  const salvarEncomenda = async (irParaPagamento = false) => {
    if (!remetenteId || !destinatarioId || pacotes.length === 0) return;

    try {
      if (irParaPagamento) setLoadingPagamento(true);
      else setLoadingSalvar(true);

      const novaEncomenda = await orderService.adicionar({
        from_account_id: remetenteId,
        to_account_id: destinatarioId,
        is_express: encomendaExpressa,
        scheduled_date: encomendaExpressa ? dataEnvioExpressa : undefined,
        packages: pacotes,
      });

      navigate(
        irParaPagamento
          ? `/admin/encomendas/${novaEncomenda.id}/pagamento`
          : "/admin/encomendas"
      );
    } finally {
      setLoadingSalvar(false);
      setLoadingPagamento(false);
    }
  };

  if (loadingTela) {
    return (
      <div>
        <div className="h-screen flex overflow-hidden">
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
          <div className="flex items-center justify-center h-screen">
            <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
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

      <main className="flex-1 overflow-y-auto bg-[#fcf8f5] p-6 space-y-6">
        <h1 className="pt-10 md:pt-0 text-2xl font-bold font-primary text-black">
          Nova Encomenda
        </h1>

        {/* Remetente */}
        <div className="space-y-2">
          <ClienteSelect
            label="Remetente"
            clientes={clientes}
            selectedId={remetenteId}
            onSelect={(id) => setRemetenteId(id)}
            onCadastrarNovo={() => setShowRemetenteForm(true)}
          />
          {showRemetenteForm && (
            <ClienteForm
              onSubmit={async (form) => {
                const endereco = {
                  street: form.street,
                  number: form.number,
                  neighborhood: form.neighborhood,
                  city: form.city,
                  state: form.state,
                  zipCode: form.zipCode,
                  country: form.country,
                };
                const novo = await clienteService.adicionar({
                  name: form.name,
                  email: form.email,
                  phoneNumber: form.phoneNumber,
                  addresses: [endereco],
                });
                setClientes(await clienteService.listar());
                setRemetenteId(novo.id);
                setShowRemetenteForm(false);
              }}
              onCancel={() => setShowRemetenteForm(false)}
            />
          )}
        </div>

        {/* Destinatário */}
        <div className="space-y-2">
          <ClienteSelect
            label="Destinatário"
            clientes={clientes}
            selectedId={destinatarioId}
            onSelect={(id) => {
              setDestinatarioId(id);
              const cliente = clientes.find((c) => c.id === id);
              if (cliente) {
                setEndereco({
                  rua: cliente.addresses[0].street,
                  numero: cliente.addresses[0].number,
                  bairro: cliente.addresses[0].neighborhood,
                  cidade: cliente.addresses[0].city,
                  estado: cliente.addresses[0].state,
                  cep: cliente.addresses[0].zipCode,
                });
              }
            }}
            onCadastrarNovo={() => setShowDestinatarioForm(true)}
          />
          {showDestinatarioForm && (
            <ClienteForm
              onSubmit={async (form) => {
                const endereco = {
                  street: form.street,
                  number: form.number,
                  neighborhood: form.neighborhood,
                  city: form.city,
                  state: form.state,
                  zipCode: form.zipCode,
                  country: form.country,
                };
                const novo = await clienteService.adicionar({
                  name: form.name,
                  email: form.email,
                  phoneNumber: form.phoneNumber,
                  addresses: [endereco],
                });
                setClientes(await clienteService.listar());
                setDestinatarioId(novo.id);
                setShowDestinatarioForm(false);
              }}
              onCancel={() => setShowDestinatarioForm(false)}
            />
          )}
        </div>

        {/* Encomenda Expressa */}
        <div className="border border-orange rounded p-4 bg-white space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={encomendaExpressa}
              onChange={(e) => setEncomendaExpressa(e.target.checked)}
            />
            Encomenda expressa (adicional R$ {adicionalExpresso.toFixed(2)})
          </label>
          {encomendaExpressa && (
            <input
              type="date"
              value={dataEnvioExpressa}
              onChange={(e) => setDataEnvioExpressa(e.target.value)}
              className="p-2 border rounded w-64"
              min={dayjs().format("YYYY-MM-DD")}
            />
          )}
        </div>

        {/* Pacotes */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-primary text-black">Pacotes</h2>

          <div className="grid md:grid-cols-5 gap-4">
            <input
              placeholder="Descrição"
              className="p-2 border rounded"
              value={descricaoPacote}
              onChange={(e) => setDescricaoPacote(e.target.value)}
            />
            <input
              placeholder="Peso (g)"
              type="number"
              className="p-2 border rounded"
              value={pesoPacote}
              onChange={(e) => setPesoPacote(e.target.value)}
            />
            <input
              placeholder="Valor Declarado (opcional)"
              type="number"
              className="p-2 border rounded"
              value={valorDeclaradoPacote}
              onChange={(e) => setValorDeclaradoPacote(e.target.value)}
            />
            <select
              className="p-2 border rounded"
              value={statusPacote}
              onChange={(e) => setStatusPacote(e.target.value as PacoteStatus)}
            >
              <option value="em preparação">Em preparação</option>
              <option value="em transito">Em trânsito</option>
              <option value="aguardando retirada">Aguardando retirada</option>
              <option value="entregue">Entregue</option>
              <option value="cancelada">Cancelada</option>
            </select>
            <button
              onClick={adicionarPacote}
              className="px-4 py-2 bg-orange text-white rounded hover:opacity-90"
            >
              Adicionar
            </button>
          </div>

          <ul className="space-y-2">
            {pacotes.map((p) => (
              <li key={p.description} className="p-2 bg-white border rounded">
                📦 {p.description} — {p.weight}kg ({p.status})
              </li>
            ))}
          </ul>
        </div>

        {/* Botões */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <button
            onClick={() => salvarEncomenda(false)}
            className="px-6 py-3 bg-black text-white rounded hover:opacity-80 font-secondary text-sm"
            disabled={loadingSalvar}
          >
            {loadingSalvar ? "Salvando..." : "Salvar Encomenda"}
          </button>

          <button
            onClick={() => salvarEncomenda(true)}
            className="px-6 py-3 bg-orange text-white rounded hover:opacity-90 font-secondary text-sm"
            disabled={loadingPagamento}
          >
            {loadingPagamento ? "Redirecionando..." : "Ir para Pagamento"}
          </button>
          <button
            onClick={
              () => salvarEncomenda(true)
              // navigate(`/admin/encomendas/${novaEncomenda.id}/pagamento`);
            }
            className="px-6 py-3 bg-orange text-white rounded hover:opacity-80 font-secondary text-sm"
          >
            Ir para Pagamento
          </button>
        </div>
      </main>
    </div>
  );
}

export default NovaEncomenda;
