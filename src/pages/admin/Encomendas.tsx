import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { clienteService, Cliente } from "../../services/clienteService";
import {
  encomendaService,
  Encomenda,
  Pacote,
  PacoteStatus,
} from "../../services/encomendaService";
import ClienteForm, { ClienteFormData } from "../../components/admin/ClienteForm";
import ClienteSelect from "../../components/admin/ClienteSelect";

function converterEnderecoParaCampos(endereco: string): Partial<ClienteFormData> {
  const match = endereco.match(/^(.*), (.*) - (.*), (.*) - (.*), (.*)$/);
  if (!match) return {};
  return {
    rua: match[1],
    numero: match[2],
    bairro: match[3],
    cidade: match[4],
    estado: match[5],
    cep: match[6],
  };
}

function Encomendas() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);

  const [remetenteId, setRemetenteId] = useState<number | undefined>(undefined);
  const [destinatarioId, setDestinatarioId] = useState<number | undefined>(undefined);
  const [editandoRemetente, setEditandoRemetente] = useState(false);
  const [showRemetenteForm, setShowRemetenteForm] = useState(false);
  const [showDestinatarioForm, setShowDestinatarioForm] = useState(false);

  const [endereco, setEndereco] = useState({
    rua: "", numero: "", bairro: "", cidade: "", estado: "", cep: "",
  });

  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [descricaoPacote, setDescricaoPacote] = useState("");
  const [pesoPacote, setPesoPacote] = useState("");
  const [statusPacote, setStatusPacote] = useState<PacoteStatus>("em preparação");

  useEffect(() => {
    clienteService.listar().then(setClientes);
    encomendaService.listar().then(setEncomendas);
  }, []);

  const adicionarPacote = () => {
    if (!descricaoPacote || !pesoPacote) return;
    const novo: Pacote = {
      id: Date.now(),
      descricao: descricaoPacote,
      peso: parseFloat(pesoPacote),
      status: statusPacote,
    };
    setPacotes([...pacotes, novo]);
    setDescricaoPacote("");
    setPesoPacote("");
    setStatusPacote("em preparação");
  };

  const salvarEncomenda = async () => {
    if (!remetenteId || !destinatarioId || pacotes.length === 0) return;

    await encomendaService.adicionar({
      remetenteId,
      destinatarioId,
      enderecoEntrega: endereco,
      status: "em preparação",
      pacotes,
    });

    setRemetenteId(undefined);
    setDestinatarioId(undefined);
    setEndereco({ rua: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" });
    setPacotes([]);
    encomendaService.listar().then(setEncomendas);
  };

  const salvarNovoCliente = async (form: ClienteFormData, tipo: "remetente" | "destinatario") => {
    const endereco = `${form.rua}, ${form.numero} - ${form.bairro}, ${form.cidade} - ${form.estado}, ${form.cep}`;
    const novo = await clienteService.adicionar({
      nome: form.nome,
      telefone: form.telefone,
      email: form.email,
      endereco,
    });
    await clienteService.listar().then(setClientes);
    if (tipo === "remetente") {
      setRemetenteId(novo.id);
      setShowRemetenteForm(false);
    } else {
      setDestinatarioId(novo.id);
      setShowDestinatarioForm(false);
    }
  };

  const remetenteSelecionado = clientes.find(c => c.id === remetenteId);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Encomendas</h1>
        </div>

        {/* Cliente Remetente */}
        <div>
          <ClienteSelect
            label="Remetente"
            clientes={clientes}
            selectedId={remetenteId}
            onSelect={setRemetenteId}
            onCadastrarNovo={() => {
              setShowRemetenteForm(true);
              setShowDestinatarioForm(false);
            }}
          />
          {remetenteId && (
            <button
              onClick={() => {
                setEditandoRemetente(true);
                setShowRemetenteForm(false);
              }}
              className="text-sm text-blue-600 mt-1 hover:underline"
            >
              Ver endereço
            </button>
          )}
          {showRemetenteForm && (
            <ClienteForm
              onSubmit={(form) => salvarNovoCliente(form, "remetente")}
              onCancel={() => setShowRemetenteForm(false)}
            />
          )}
          {editandoRemetente && remetenteSelecionado && (
            <ClienteForm
              initialData={{
                nome: remetenteSelecionado.nome,
                telefone: remetenteSelecionado.telefone,
                email: remetenteSelecionado.email,
                ...converterEnderecoParaCampos(remetenteSelecionado.endereco),
              }}
              onSubmit={async (form) => {
                const endereco = `${form.rua}, ${form.numero} - ${form.bairro}, ${form.cidade} - ${form.estado}, ${form.cep}`;
                await clienteService.atualizar(remetenteId!, {
                  nome: form.nome,
                  telefone: form.telefone,
                  email: form.email,
                  endereco,
                });
                await clienteService.listar().then(setClientes);
                setEditandoRemetente(false);
              }}
              onCancel={() => setEditandoRemetente(false)}
            />
          )}
        </div>

        {/* Cliente Destinatário */}
        <div>
          <ClienteSelect
            label="Destinatário"
            clientes={clientes}
            selectedId={destinatarioId}
            onSelect={setDestinatarioId}
            onCadastrarNovo={() => {
              setShowDestinatarioForm(true);
              setShowRemetenteForm(false);
            }}
          />
          {showDestinatarioForm && (
            <ClienteForm
              onSubmit={(form) => salvarNovoCliente(form, "destinatario")}
              onCancel={() => setShowDestinatarioForm(false)}
            />
          )}
        </div>

        {/* Endereço de Entrega */}
        <div className="grid md:grid-cols-2 gap-4">
          <input name="rua" placeholder="Rua" value={endereco.rua} onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })} className="p-2 border rounded" />
          <input name="numero" placeholder="Número" value={endereco.numero} onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })} className="p-2 border rounded" />
          <input name="bairro" placeholder="Bairro" value={endereco.bairro} onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })} className="p-2 border rounded" />
          <input name="cidade" placeholder="Cidade" value={endereco.cidade} onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })} className="p-2 border rounded" />
          <input name="estado" placeholder="Estado" value={endereco.estado} onChange={(e) => setEndereco({ ...endereco, estado: e.target.value })} className="p-2 border rounded" />
          <input name="cep" placeholder="CEP" value={endereco.cep} onChange={(e) => setEndereco({ ...endereco, cep: e.target.value })} className="p-2 border rounded" />
        </div>

        {/* Pacotes */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Pacotes</h2>
          <div className="grid md:grid-cols-4 gap-4 items-end">
            <input placeholder="Descrição" className="p-2 border rounded" value={descricaoPacote} onChange={(e) => setDescricaoPacote(e.target.value)} />
            <input placeholder="Peso (kg)" type="number" className="p-2 border rounded" value={pesoPacote} onChange={(e) => setPesoPacote(e.target.value)} />
            <select className="p-2 border rounded" value={statusPacote} onChange={(e) => setStatusPacote(e.target.value as PacoteStatus)}>
              <option value="em preparação">Em preparação</option>
              <option value="em transito">Em trânsito</option>
              <option value="aguardando retirada">Aguardando retirada</option>
              <option value="entregue">Entregue</option>
              <option value="cancelada">Cancelada</option>
            </select>
            <button onClick={adicionarPacote} className="px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90">
              Adicionar
            </button>
          </div>
          {pacotes.length > 0 && (
            <ul className="space-y-2 mt-2">
              {pacotes.map((p) => (
                <li key={p.id} className="p-2 bg-white rounded border">
                  <p>
                    <strong>{p.descricao}</strong> - {p.peso}kg ({p.status})
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={salvarEncomenda} className="mt-4 px-4 py-2 bg-black text-white rounded hover:opacity-80">
          Salvar Encomenda
        </button>

        {/* Lista de Encomendas */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Lista de Encomendas</h2>
          {encomendas.length === 0 ? (
            <p className="text-gray-600">Nenhuma encomenda cadastrada.</p>
          ) : (
            <ul className="space-y-4">
              {encomendas.map((e) => {
                const remetente = clientes.find((c) => c.id === e.remetenteId)?.nome || "—";
                const destinatario = clientes.find((c) => c.id === e.destinatarioId)?.nome || "—";
                return (
                  <li key={e.id} className="p-4 bg-white rounded shadow">
                    <p><strong>De:</strong> {remetente} <strong>Para:</strong> {destinatario}</p>
                    <p><strong>Status:</strong> {e.status}</p>
                    <p><strong>Endereço:</strong> {e.enderecoEntrega.rua}, {e.enderecoEntrega.numero} - {e.enderecoEntrega.bairro}, {e.enderecoEntrega.cidade} - {e.enderecoEntrega.estado}, {e.enderecoEntrega.cep}</p>
                    <ul className="mt-2 space-y-1">
                      {e.pacotes.map((p) => (
                        <li key={p.id} className="text-sm">
                          📦 <strong>{p.descricao}</strong> - {p.peso}kg ({p.status})
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
}

export default Encomendas;
