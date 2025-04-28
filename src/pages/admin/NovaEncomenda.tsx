// src/pages/admin/NovaEncomenda.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { clienteService, Cliente } from "../../services/clienteService";
import { remessaService } from "../../services/remessaService";
import { configService } from "../../services/configService";
import {
  encomendaService,
  Pacote,
  PacoteStatus,
} from "../../services/encomendaService";
import ClienteForm, {
  ClienteFormData,
} from "../../components/admin/ClienteForm";
import ClienteSelect from "../../components/admin/ClienteSelect";
import dayjs from "dayjs";

function converterEnderecoParaCampos(endereco: string): ClienteFormData {
  const match = endereco.match(/^(.*), (.*) - (.*), (.*) - (.*), (.*)$/);
  if (!match) {
    return {
      nome: "",
      telefone: "",
      email: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    };
  }
  return {
    nome: "",
    telefone: "",
    email: "",
    rua: match[1],
    numero: match[2],
    bairro: match[3],
    cidade: match[4],
    estado: match[5],
    cep: match[6],
  };
}

function NovaEncomenda() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const [remetenteId, setRemetenteId] = useState<number>();
  const [destinatarioId, setDestinatarioId] = useState<number>();
  const [endereco, setEndereco] = useState({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [descricaoPacote, setDescricaoPacote] = useState("");
  const [pesoPacote, setPesoPacote] = useState("");
  const [valorDeclaradoPacote, setValorDeclaradoPacote] = useState("");
  const [statusPacote, setStatusPacote] =
    useState<PacoteStatus>("em preparação");

  const [encomendaExpressa, setEncomendaExpressa] = useState(false);
  const [dataEnvioExpressa, setDataEnvioExpressa] = useState("");
  const [precoPorQuilo, setPrecoPorQuilo] = useState<number>(0);
  const [taxaSeguro, setTaxaSeguro] = useState<number>(0);
  const [adicionalExpresso, setAdicionalExpresso] = useState<number>(0);

  const [showRemetenteForm, setShowRemetenteForm] = useState(false);
  const [showDestinatarioForm, setShowDestinatarioForm] = useState(false);

  useEffect(() => {
    clienteService.listar().then(setClientes);
    configService.carregar().then((conf) => {
      setPrecoPorQuilo(conf.precoPorQuilo);
      setTaxaSeguro(conf.taxaPorSeguro);
      setAdicionalExpresso(conf.adicionalExpresso || 0);
    });
  }, []);

  const adicionarPacote = () => {
    if (!descricaoPacote || !pesoPacote) return;
    const peso = parseFloat(pesoPacote);
    const declarado = valorDeclaradoPacote
      ? parseFloat(valorDeclaradoPacote)
      : 0;
    const valorCalculado = peso * precoPorQuilo;
    const valorSeguro = declarado * (taxaSeguro / 100);
    const valorTotal = valorCalculado + valorSeguro;

    const novo: Pacote = {
      id: Date.now(),
      descricao: descricaoPacote,
      peso,
      status: statusPacote,
      valorCalculado,
      valorDeclarado: declarado,
      valorTotal,
    };
    setPacotes([...pacotes, novo]);
    setDescricaoPacote("");
    setPesoPacote("");
    setValorDeclaradoPacote("");
    setStatusPacote("em preparação");
  };

  const salvarEncomenda = async () => {
    if (!remetenteId || !destinatarioId || pacotes.length === 0) return;
    const valorPacotes = pacotes.reduce((s, p) => s + (p.valorTotal || 0), 0);
    const valorTotal = encomendaExpressa
      ? valorPacotes + adicionalExpresso
      : valorPacotes;

    const nova = await encomendaService.adicionar({
      remetenteId,
      destinatarioId,
      enderecoEntrega: endereco,
      status: "em preparação",
      pacotes,
      valorTotal,
      expressa: encomendaExpressa,
      dataEnvio: encomendaExpressa ? dataEnvioExpressa : undefined,
    });

    await remessaService.adicionarEncomendaOuCriar(nova, endereco.cidade);
    navigate("/admin/encomendas");
  };

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
            onSelect={setRemetenteId}
            onCadastrarNovo={() => {
              setShowRemetenteForm(true);
            }}
          />
          {showRemetenteForm && (
            <ClienteForm
              onSubmit={async (form) => {
                const enderecoStr = `${form.rua}, ${form.numero} - ${form.bairro}, ${form.cidade} - ${form.estado}, ${form.cep}`;
                const novo = await clienteService.adicionar({
                  nome: form.nome,
                  telefone: form.telefone,
                  email: form.email,
                  endereco: enderecoStr,
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
                setEndereco(converterEnderecoParaCampos(cliente.endereco));
              }
            }}
            onCadastrarNovo={() => {
              setShowDestinatarioForm(true);
            }}
          />
          {showDestinatarioForm && (
            <ClienteForm
              onSubmit={async (form) => {
                const enderecoStr = `${form.rua}, ${form.numero} - ${form.bairro}, ${form.cidade} - ${form.estado}, ${form.cep}`;
                const novo = await clienteService.adicionar({
                  nome: form.nome,
                  telefone: form.telefone,
                  email: form.email,
                  endereco: enderecoStr,
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
              placeholder="Peso (kg)"
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
              <li key={p.id} className="p-2 bg-white border rounded">
                📦 {p.descricao} — {p.peso}kg ({p.status})
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col md:flex-row md:justify-start gap-4 mt-6">
          <button
            onClick={salvarEncomenda}
            className="px-6 py-3 bg-black text-white rounded hover:opacity-80 font-secondary text-sm"
          >
            Salvar Encomenda
          </button>

          <button
            onClick={async () => {
              if (!remetenteId || !destinatarioId || pacotes.length === 0)
                return;

              const valorTotal = pacotes.reduce(
                (soma, p) => soma + (p.valorTotal || 0),
                0
              );

              const nova = await encomendaService.adicionar({
                remetenteId,
                destinatarioId,
                enderecoEntrega: endereco,
                status: "em preparação",
                pacotes,
                valorTotal,
                expressa: encomendaExpressa,
                dataEnvio: encomendaExpressa ? dataEnvioExpressa : undefined,
              });

              await remessaService.adicionarEncomendaOuCriar(
                nova,
                endereco.cidade
              );
              navigate(`/admin/encomendas/${nova.id}/pagamento`);
            }}
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
