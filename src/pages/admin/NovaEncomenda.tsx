import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { clienteService, Cliente } from "../../services/clienteService";
import { configService } from "../../services/configService";
import ClienteSelect from "../../components/admin/ClienteSelect";
import dayjs from "dayjs";
import { orderService, PacoteStatus } from "../../services/encomendaService";
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

  const [loadingTela, setLoadingTela] = useState(true);
  const [statusPacote, setStatusPacote] =
    useState<PacoteStatus>("em_preparacao");

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
  const [showRemetenteEndereco, setShowRemetenteEndereco] = useState(false);
  const [showDestinatarioEndereco, setShowDestinatarioEndereco] =
    useState(false);

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
      status: statusPacote,
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

      const destinatario = clientes.find((c) => c.id === destinatarioId);
      const endereco = destinatario?.addresses?.[0];
      if (!endereco) return;
      const novaEncomenda = await orderService.adicionar({
        status: "em_preparacao",
        from_account_id: remetenteId,
        to_account_id: destinatarioId,
        is_express: encomendaExpressa,
        scheduled_date: encomendaExpressa ? dataEnvioExpressa : undefined,
        city: endereco.city,
        state: endereco.state,
        country: endereco.country,
        number: endereco.number,
        cep: endereco.zipCode,
        additional_info: "",
        paid_now: "",
        descount: "",
        payment_type: "",
        total_value: "",
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

        <div className="flex-1 flex items-center justify-center bg-[#fcf8f5]">
          <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
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
            onSelect={(id) => {
              setRemetenteId(id);
              setShowRemetenteEndereco(false);
            }}
            onCadastrarNovo={() => setShowRemetenteForm(true)}
          />

          {remetenteId && (
            <button
              className="text-sm text-blue-600 "
              onClick={() => setShowRemetenteEndereco((prev) => !prev)}
            >
              {showRemetenteEndereco ? "Ocultar endereço" : "Ver endereço"}
            </button>
          )}

          {showRemetenteEndereco && (
            <div className="grid md:grid-cols-3 gap-2 bg-white p-4 border border-orange rounded">
              {(() => {
                const cliente = clientes.find((c) => c.id === remetenteId);
                const addr = cliente?.addresses?.[0];
                if (!addr) return <p>Sem endereço cadastrado.</p>;
                return (
                  <>
                    <input
                      disabled
                      className="p-2 border rounded"
                      value={addr.street}
                    />
                    <input
                      disabled
                      className="p-2 border rounded"
                      value={addr.number}
                    />
                    <input
                      disabled
                      className="p-2 border rounded"
                      value={addr.neighborhood}
                    />
                    <input
                      disabled
                      className="p-2 border rounded"
                      value={addr.city}
                    />
                    <input
                      disabled
                      className="p-2 border rounded"
                      value={addr.state}
                    />
                    <input
                      disabled
                      className="p-2 border rounded"
                      value={addr.zipCode}
                    />
                  </>
                );
              })()}
            </div>
          )}

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
                const novaLista = await clienteService.listar();
                setClientes(novaLista);
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
              setShowDestinatarioEndereco(false);
              const cliente = clientes.find((c) => c.id === id);
              if (cliente) {
                setEndereco({
                  rua: cliente.addresses[0]?.street || "",
                  numero: cliente.addresses[0]?.number || "",
                  bairro: cliente.addresses[0]?.neighborhood || "",
                  cidade: cliente.addresses[0]?.city || "",
                  estado: cliente.addresses[0]?.state || "",
                  cep: cliente.addresses[0]?.zipCode || "",
                });
              }
            }}
            onCadastrarNovo={() => setShowDestinatarioForm(true)}
          />

          {destinatarioId && (
            <button
              className="text-sm text-blue-600 "
              onClick={() => setShowDestinatarioEndereco((prev) => !prev)}
            >
              {showDestinatarioEndereco ? "Ocultar endereço" : "Ver endereço"}
            </button>
          )}

          {showDestinatarioEndereco && (
            <div className="grid md:grid-cols-3 gap-2 bg-white p-4 border border-orange rounded">
              {(() => {
                const cliente = clientes.find((c) => c.id === destinatarioId);
                const addr = cliente?.addresses?.[0];
                if (!addr) return <p>Sem endereço cadastrado.</p>;
                return (
                  <>
                    <input
                      disabled
                      className="p-2 border rounded"
                      value={addr.street}
                    />
                    <input
                      disabled
                      className="p-2 border rounded"
                      value={addr.number}
                    />
                    <input
                      disabled
                      className="p-2 border rounded"
                      value={addr.neighborhood}
                    />
                    <input
                      disabled
                      className="p-2 border rounded"
                      value={addr.city}
                    />
                    <input
                      disabled
                      className="p-2 border rounded"
                      value={addr.state}
                    />
                    <input
                      disabled
                      className="p-2 border rounded"
                      value={addr.zipCode}
                    />
                  </>
                );
              })()}
            </div>
          )}

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
                const novaLista = await clienteService.listar();
                setClientes(novaLista);
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
              placeholder="Peso (kg)"
              type="number"
              step="0.1"
              className="p-2 border rounded"
              value={pesoPacote}
              onChange={(e) => setPesoPacote(e.target.value)}
              onBlur={() => {
                const num = parseFloat(pesoPacote.replace(",", "."));
                if (!isNaN(num)) {
                  setPesoPacote(num.toFixed(1));
                }
              }}
            />
            <input
              placeholder="Valor Declarado (opcional)"
              type="number"
              step="0.1"
              className="p-2 border rounded"
              value={valorDeclaradoPacote}
              onChange={(e) => setValorDeclaradoPacote(e.target.value)}
              onBlur={() => {
                const num = parseFloat(valorDeclaradoPacote.replace(",", "."));
                if (!isNaN(num)) {
                  setValorDeclaradoPacote(num.toFixed(1));
                } else {
                  setValorDeclaradoPacote("0.0");
                }
              }}
            />
            <select
              className="p-2 border rounded"
              value={statusPacote}
              onChange={(e) => setStatusPacote(e.target.value as PacoteStatus)}
            >
              <option value="em_preparacao">Em preparação</option>
              <option value="em_transito">Em trânsito</option>
              <option value="aguardando_retirada">Aguardando retirada</option>
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
            onClick={
              () => salvarEncomenda(true)
              // navigate(`/admin/encomendas/${novaEncomenda.id}/pagamento`);
            }
            className="px-6 py-3 bg-orange text-white rounded hover:opacity-80 font-secondary text-sm"
          >
            {loadingPagamento ? "Redirecionando..." : "Ir para Pagamento"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default NovaEncomenda;
