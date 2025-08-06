import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/useLanguage"; // ⬅️ importação do hook de tradução
import Sidebar from "../../components/admin/Sidebar";
import {
  clienteService,
  Cliente,
  Address,
} from "../../services/clienteService";
import { configService } from "../../services/configService";
import ClienteSelect from "../../components/admin/ClienteSelect";
import dayjs from "dayjs";
import { orderService, PacoteStatus } from "../../services/encomendaService";
import ClienteForm from "../../components/admin/ClienteForm";
import DecimalMoneyInput from "../../components/form/DecimalMoneyInput";

function NovaEncomenda() {
  const { translations: t } = useLanguage(); // ⬅️ hook com os textos traduzidos
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);

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
const [editandoPacoteIndex, setEditandoPacoteIndex] = useState<number | null>(null);
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
  const [enderecoEditavel, setEnderecoEditavel] = useState<Address | null>(
    null
  );
  const [enderecoOriginal, setEnderecoOriginal] = useState<Address | null>(
    null
  );
  const [enderecoSelecionado, setEnderecoSelecionado] =
    useState<Address | null>(null);
  const [enderecoEditavelRemetente, setEnderecoEditavelRemetente] =
    useState<Address | null>(null);
  const [enderecoOriginalRemetente, setEnderecoOriginalRemetente] =
    useState<Address | null>(null);
  const [
    exibindoListaEnderecosDestinatario,
    setExibindoListaEnderecosDestinatario,
  ] = useState(false);
  const [exibindoListaEnderecosRemetente, setExibindoListaEnderecosRemetente] =
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

  if (editandoPacoteIndex !== null) {
    // Editando pacote existente
    const pacotesAtualizados = [...pacotes];
    pacotesAtualizados[editandoPacoteIndex] = novoPacote;
    setPacotes(pacotesAtualizados);
    setEditandoPacoteIndex(null);
  } else {
    // Adicionando novo pacote
    setPacotes([...pacotes, novoPacote]);
  }

  setDescricaoPacote("");
  setPesoPacote("");
  setValorDeclaradoPacote("");
  setStatusPacote("em_preparacao");
};

const excluirPacote = (index: number) => {
  const pacotesAtualizados = pacotes.filter((_, i) => i !== index);
  setPacotes(pacotesAtualizados);
  
  // Se estava editando o pacote que foi excluído, cancelar edição
  if (editandoPacoteIndex === index) {
    cancelarEdicao();
  }
};

const editarPacote = (index: number) => {
  const pacote = pacotes[index];
  setDescricaoPacote(pacote.description);
  setPesoPacote(pacote.weight);
  setValorDeclaradoPacote(pacote.declared_value);
  setStatusPacote(pacote.status as PacoteStatus);
  setEditandoPacoteIndex(index);
};

const cancelarEdicao = () => {
  setDescricaoPacote("");
  setPesoPacote("");
  setValorDeclaradoPacote("");
  setStatusPacote("em_preparacao");
  setEditandoPacoteIndex(null);
};

  const salvarEncomenda = async (irParaPagamento = false) => {
    if (!remetenteId || !destinatarioId || pacotes.length === 0) return;
    try {
      if (irParaPagamento) setLoadingPagamento(true);
      else setLoadingSalvar(true);

      const endereco = enderecoSelecionado;
      if (!endereco) return;
      const novaEncomenda = await orderService.adicionar({
        status: "em_preparacao",
        from_account_id: remetenteId,
        to_account_id: destinatarioId,
        is_express: encomendaExpressa,
        scheduled_date: encomendaExpressa ? dataEnvioExpressa : undefined,
        city: endereco.city || "",
        state: endereco.state || "",
        country: endereco.country || "",
        number: endereco.number || "",
        cep: endereco.cep || "",
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
          ☰ {t.menu}
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
        ☰ {t.menu}
      </button>

      <Sidebar
        mobileAberta={sidebarAberta}
        onFechar={() => setSidebarAberta(false)}
      />

      <main className="flex-1 overflow-y-auto bg-[#fcf8f5] p-6 space-y-6">
        <h1 className="pt-10 md:pt-0 text-2xl font-bold font-primary text-black">
          {t.nova_encomenda}
        </h1>

        {/* Remetente */}
        <div className="space-y-2">
          <ClienteSelect
            label={t.remetente}
            clientes={clientes}
            selectedId={remetenteId}
            onSelect={(id) => {
              setRemetenteId(id);
              setShowRemetenteEndereco(false);
              const cliente = clientes.find((c) => c.id === id);
              const endereco = cliente?.adresses?.[0];
              if (endereco) {
                const enderecoLower = {
                  street: endereco.street?.toLowerCase() || "",
                  number: endereco.number?.toLowerCase() || "",
                  neighborhood: endereco.neighborhood?.toLowerCase() || "",
                  city: endereco.city?.toLowerCase() || "",
                  state: endereco.state?.toLowerCase() || "",
                  cep: endereco.cep?.toLowerCase() || "",
                  country: endereco.country?.toLowerCase() || "",
                };
                setEnderecoEditavelRemetente(enderecoLower);
                setEnderecoOriginalRemetente(enderecoLower);
              }
            }}
            onCadastrarNovo={() => setShowRemetenteForm(true)}
          />

          {remetenteId && (
            <div className="flex gap-4">
              <button
                className="text-sm text-blue-600"
                onClick={() => {
                  setShowRemetenteEndereco((prev) => !prev);
                  setExibindoListaEnderecosRemetente(false);
                }}
              >
                {showRemetenteEndereco ? t.ocultar_endereco : t.ver_endereco}
              </button>
              <button
                className="text-sm text-blue-600"
                onClick={() => {
                  setExibindoListaEnderecosRemetente((prev) => !prev);
                  setShowRemetenteEndereco(false);
                }}
              >
                {exibindoListaEnderecosRemetente
                  ? t.ocultar_enderecos_salvos
                  : t.enderecos_salvos}
              </button>
            </div>
          )}
          {exibindoListaEnderecosRemetente && (
            <div className="space-y-2 bg-white p-4 border border-orange rounded">
              {clientes
                .find((c) => c.id === remetenteId)
                ?.adresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-2 border rounded hover:bg-orange-100 cursor-pointer"
                    onClick={() => {
                      const enderecoLower = {
                        street: addr.street?.toLowerCase() || "",
                        number: addr.number?.toLowerCase() || "",
                        neighborhood: addr.neighborhood?.toLowerCase() || "",
                        city: addr.city?.toLowerCase() || "",
                        state: addr.state?.toLowerCase() || "",
                        cep: addr.cep?.toLowerCase() || "",
                        country: addr.country?.toLowerCase() || "",
                      };
                      setEnderecoEditavelRemetente(enderecoLower);
                      setEnderecoOriginalRemetente(enderecoLower);
                      setExibindoListaEnderecosRemetente(false);
                    }}
                  >
                    {addr.street}, {addr.number}, {addr.neighborhood},{" "}
                    {addr.city} - {addr.state}, {addr.cep} ({addr.country})
                  </div>
                ))}
            </div>
          )}
          {showRemetenteEndereco && enderecoEditavelRemetente && (
            <div className="grid md:grid-cols-3 gap-2 bg-white p-4 border border-orange rounded">
              {[
                ["street", t.rua],
                ["number", t.numero],
                ["neighborhood", t.bairro],
                ["city", t.cidade],
                ["state", t.estado],
                ["cep", t.cep],
                ["country", t.pais],
              ].map(([key, label]) => (
                <input
                  key={key}
                  className="p-2 border rounded"
                  value={enderecoEditavelRemetente[key as keyof Address] || ""}
                  onChange={(e) =>
                    setEnderecoEditavelRemetente((prev) =>
                      prev
                        ? { ...prev, [key]: e.target.value.toLowerCase() }
                        : null
                    )
                  }
                  placeholder={label}
                />
              ))}

              {JSON.stringify(enderecoEditavelRemetente) !==
                JSON.stringify(enderecoOriginalRemetente) && (
                <button
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded col-span-full"
                  onClick={async () => {
                    if (!remetenteId || !enderecoEditavelRemetente) return;
                    const cliente = clientes.find((c) => c.id === remetenteId);
                    if (!cliente) return;
                    await clienteService.atualizar(remetenteId, {
                      ...cliente,
                      adresses: [
                        ...cliente.adresses,
                        enderecoEditavelRemetente,
                      ],
                    });
                    const novaLista = await clienteService.listar();
                    setClientes(novaLista);
                    setEnderecoOriginalRemetente({
                      ...enderecoEditavelRemetente,
                    });
                    setShowRemetenteEndereco(false);
                  }}
                >
                  {t.salvar_endereco}
                </button>
              )}
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
                  cep: form.cep,
                  country: form.country,
                };
                const novo = await clienteService.adicionar({
                  name: form.name,
                  last_name: form.last_name,
                  email: form.email,
                  phone_number: form.phone_number,
                  adresses: [endereco],
                  removed_adresses: [],
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
            label={t.destinatario}
            clientes={clientes}
            selectedId={destinatarioId}
            onSelect={(id) => {
              setDestinatarioId(id);
              setShowDestinatarioEndereco(false);
              setExibindoListaEnderecosDestinatario(false);
              const cliente = clientes.find((c) => c.id === id);
              const endereco = cliente?.adresses?.[0];
              if (endereco) {
                const enderecoLower = {
                  street: endereco.street?.toLowerCase() || "",
                  number: endereco.number?.toLowerCase() || "",
                  neighborhood: endereco.neighborhood?.toLowerCase() || "",
                  city: endereco.city?.toLowerCase() || "",
                  state: endereco.state?.toLowerCase() || "",
                  cep: endereco.cep?.toLowerCase() || "",
                  country: endereco.country?.toLowerCase() || "",
                };
                setEnderecoEditavel(enderecoLower);
                setEnderecoOriginal(enderecoLower);
                setEnderecoSelecionado(enderecoLower);
              }
              setShowDestinatarioEndereco((prev) => !prev);
              setExibindoListaEnderecosDestinatario(false);
            }}
            onCadastrarNovo={() => setShowDestinatarioForm(true)}
          />

          {destinatarioId && (
            <div className="flex gap-4">
              <button
                className="text-sm text-blue-600"
                onClick={() => {
                  setShowDestinatarioEndereco((prev) => !prev);
                  setExibindoListaEnderecosDestinatario(false);
                }}
              >
                {showDestinatarioEndereco ? t.ocultar_endereco : t.ver_endereco}
              </button>
              <button
                className="text-sm text-blue-600"
                onClick={() => {
                  setExibindoListaEnderecosDestinatario((prev) => !prev);
                  setShowDestinatarioEndereco(false);
                }}
              >
                {exibindoListaEnderecosDestinatario
                  ? t.ocultar_enderecos_salvos
                  : t.enderecos_salvos}
              </button>
            </div>
          )}

          {exibindoListaEnderecosDestinatario && (
            <div className="space-y-2 bg-white p-4 border border-orange rounded">
              {clientes
                .find((c) => c.id === destinatarioId)
                ?.adresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-2 border rounded hover:bg-orange-100 cursor-pointer"
                    onClick={() => {
                      const enderecoLower = {
                          street: addr.street?.toLowerCase() || "",
                        number: addr.number?.toLowerCase() || "",
                        neighborhood: addr.neighborhood?.toLowerCase() || "",
                        city: addr.city?.toLowerCase() || "",
                        state: addr.state?.toLowerCase() || "",
                        cep: addr.cep?.toLowerCase() || "",
                        country: addr.country?.toLowerCase() || "",
                      };
                      setEnderecoEditavel(enderecoLower);
                      setEnderecoOriginal(enderecoLower);
                      setEnderecoSelecionado(enderecoLower);
                      setExibindoListaEnderecosDestinatario(false);
                    }}
                  >
                    {addr.street}, {addr.number}, {addr.neighborhood},{" "}
                    {addr.city} - {addr.state}, {addr.cep} ({addr.country})
                  </div>
                ))}
            </div>
          )}

          {showDestinatarioEndereco && enderecoEditavel && (
            <div className="grid md:grid-cols-3 gap-2 bg-white p-4 border border-orange rounded">
              {[
                ["street", t.rua],
                ["number", t.numero],
                ["neighborhood", t.bairro],
                ["city", t.cidade],
                ["state", t.estado],
                ["cep", t.cep],
                ["country", t.pais],
              ].map(([key, label]) => (
                <input
                  key={key}
                  className="p-2 border rounded"
                  value={enderecoEditavel[key as keyof Address] || ""}
                  onChange={(e) =>
                    setEnderecoEditavel((prev) =>
                      prev
                        ? { ...prev, [key]: e.target.value.toLowerCase() }
                        : null
                    )
                  }
                  placeholder={label}
                />
              ))}

              {JSON.stringify(enderecoEditavel) !==
                JSON.stringify(enderecoOriginal) && (
                <button
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded col-span-full"
                  onClick={async () => {
                    if (!destinatarioId || !enderecoEditavel) return;
                    const cliente = clientes.find(
                      (c) => c.id === destinatarioId
                    );
                    if (!cliente) return;
                    await clienteService.atualizar(destinatarioId, {
                      ...cliente,
                      adresses: [...cliente.adresses, enderecoEditavel],
                    });
                    const novaLista = await clienteService.listar();
                    setClientes(novaLista);
                    setEnderecoOriginal({ ...enderecoEditavel });
                    setEnderecoSelecionado({ ...enderecoEditavel });
                    setShowDestinatarioEndereco(false);
                  }}
                >
                  {t.salvar_endereco}
                </button>
              )}
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
                  cep: form.cep,
                  country: form.country,
                };
                const novo = await clienteService.adicionar({
                  name: form.name,
                  last_name: form.last_name,
                  email: form.email,
                  phone_number: form.phone_number,
                  adresses: [endereco],
                  removed_adresses: [],
                });
                const novaLista = await clienteService.listar();
                setClientes(novaLista);
                setDestinatarioId(novo.id);
                setShowDestinatarioForm(false);
                setEnderecoSelecionado(endereco);
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
            {t.encomenda_expressa} ({t.adicional} R${" "}
            {adicionalExpresso.toFixed(2)})
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
          <h2 className="text-lg font-bold font-primary text-black">
            {t.pacotes}
          </h2>

          <div className="grid md:grid-cols-5 gap-4">
            <input
              placeholder={t.descricao}
              className="p-2 border rounded"
              value={descricaoPacote}
              onChange={(e) => setDescricaoPacote(e.target.value)}
            />
            <DecimalMoneyInput
              value={pesoPacote}
              onChange={(val) => setPesoPacote(val)}
              placeholder={t.peso_kg}
              decimalPlaces={2}
            />
            <DecimalMoneyInput
              value={valorDeclaradoPacote}
              onChange={(val) => setValorDeclaradoPacote(val)}
              placeholder={t.valor_declarado}
              decimalPlaces={2}
            />

            <select
              className="p-2 border rounded"
              value={statusPacote}
              onChange={(e) => setStatusPacote(e.target.value as PacoteStatus)}
            >
              <option value="em_preparacao">{t.status_em_preparacao}</option>
              <option value="em_transito">{t.status_em_transito}</option>
              <option value="aguardando_retirada">
                {t.status_aguardando_retirada}
              </option>
              <option value="entregue">{t.status_entregue}</option>
              <option value="cancelada">{t.status_cancelada}</option>
            </select>
            
            <div className="flex gap-2">
              <button
                onClick={adicionarPacote}
                className="flex-1 px-4 py-2 bg-orange text-white rounded hover:opacity-90"
              >
                {editandoPacoteIndex !== null ? t.atualizar || "Atualizar" : t.adicionar}
              </button>
              {editandoPacoteIndex !== null && (
                <button
                  onClick={cancelarEdicao}
                  className="px-3 py-2 bg-gray-500 text-white rounded hover:opacity-90"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <ul className="space-y-2">
            {pacotes.map((p, index) => (
              <li key={`${p.description}-${index}`} className="p-3 bg-white border rounded flex items-center justify-between">
                <div className="flex-1">
                  <span className="font-medium">📦 {p.description}</span>
                  <span className="text-gray-600 ml-2">— {p.weight}kg</span>
                  {p.declared_value !== "0" && (
                    <span className="text-green-600 ml-2">— R$ {p.declared_value}</span>
                  )}
                  <span className="text-blue-600 ml-2 text-sm">({p.status})</span>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => editarPacote(index)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:opacity-90"
                    title="Editar pacote"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => excluirPacote(index)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:opacity-90"
                    title="Excluir pacote"
                  >
                    🗑️
                  </button>
                </div>
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
            {loadingSalvar ? t.salvando : t.salvar_encomenda}
          </button>

          <button
            onClick={async () => {
              await salvarEncomenda(true);
            }}
            className="px-6 py-3 bg-orange text-white rounded hover:opacity-80 font-secondary text-sm"
          >
            {loadingPagamento ? t.redirecionando : t.ir_para_pagamento}
          </button>
        </div>
      </main>
    </div>
  );
}

export default NovaEncomenda;

