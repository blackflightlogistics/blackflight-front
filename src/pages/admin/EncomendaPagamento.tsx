import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { clienteService, Cliente } from "../../services/clienteService";
import {
  orderService,
  Order,
  FormaPagamento,
  PacoteStatus,
} from "../../services/encomendaService";
import { formatarLinkWhatsapp } from "../../utils/formatarLinkWhatsapp";
import { useLanguage } from "../../context/useLanguage";
import DecimalMoneyInput from "../../components/form/DecimalMoneyInput";
function EncomendaPagamento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { translations: t } = useLanguage();
  const [encomenda, setEncomenda] = useState<Order | null>(null);
  const [remetente, setRemetente] = useState<Cliente | null>(null);
  const [destinatario, setDestinatario] = useState<Cliente | null>(null);
  const [formaPagamento, setFormaPagamento] =
    useState<FormaPagamento>("a_vista");
  const [desconto, setDesconto] = useState("");
  const [mostrarMaisOpcoes, setMostrarMaisOpcoes] = useState(false);
  const [valorPagoInput, setValorPagoInput] = useState("");
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [pacotesSelecionados, setPacotesSelecionados] = useState<string[]>([]);
  const [pacotesRemovidos, setPacotesRemovidos] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [descricaoPacote, setDescricaoPacote] = useState("");
  const [pesoPacote, setPesoPacote] = useState("");
  const [valorDeclaradoPacote, setValorDeclaradoPacote] = useState("");
  const [pacotesAdicionados, setPacotesAdicionados] = useState<
    {
      description: string;
      weight: string;
      status: string;
      declared_value: string;
    }[]
  >([]);
  const [statusPacote, setStatusPacote] =
    useState<PacoteStatus>("em_preparacao");
  const adicionarPacote = () => {
    if (!descricaoPacote || !pesoPacote) return;

    const novoPacote = {
      description: descricaoPacote,
      weight: pesoPacote,
      status: statusPacote,
      declared_value: valorDeclaradoPacote || "0",
    };

    setPacotesAdicionados([...pacotesAdicionados, novoPacote]);
    setDescricaoPacote("");
    setPesoPacote("");
    setValorDeclaradoPacote("");
  };

  const togglePacote = (id: string) => {
    setPacotesSelecionados((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleRemoverPacote = (id: string) => {
    setPacotesRemovidos((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleTodos = () => {
    if (!encomenda) return;
    if (pacotesSelecionados.length === encomenda.packages.length) {
      setPacotesSelecionados([]);
    } else {
      setPacotesSelecionados(encomenda.packages.map((p) => p.id));
    }
  };

  const estaSelecionado = (id: string) => pacotesSelecionados.includes(id);
  const carregar = async () => {
    if (!id) return;
    setCarregando(true);
    const encomendaEncontrada = await orderService.buscarPorId(id);
    setEncomenda(encomendaEncontrada);
    setFormaPagamento(
      (encomendaEncontrada.payment_type as FormaPagamento) || "a_vista"
    );
    setValorPagoInput(encomendaEncontrada.paid_now || "");
    setDesconto(encomendaEncontrada.descount || "");
    setPacotesSelecionados(encomendaEncontrada.packages.map((p) => p.id));

    const remetente = await clienteService.buscarPorId(
      encomendaEncontrada.from_account_id
    );
    const destinatario = await clienteService.buscarPorId(
      encomendaEncontrada.to_account_id
    );

    setRemetente(remetente);
    setDestinatario(destinatario);
    setCarregando(false);
  };
  useEffect(() => {
    if (!id) return;

    carregar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const valorBase = Number(encomenda?.total_value) || 0;
  const valorDesconto = desconto ? parseFloat(desconto) : 0;
  const valorFinal = Math.max(0, valorBase - valorDesconto);
  const valorPago =
    formaPagamento === "a_vista" ? valorFinal : parseFloat(valorPagoInput) || 0;

  const statusPagamento =
    valorPago >= valorFinal ? "pago" : valorPago > 0 ? "parcial" : "pendente";

  const salvarPagamento = async () => {
    if (!encomenda) return;

    await orderService.atualizar(encomenda.id, {
      payment_status: statusPagamento,
      from_account_id: encomenda.from_account_id,
      to_account_id: encomenda.to_account_id,
      status: encomenda.status || undefined,
      is_express: encomenda.is_express,
      scheduled_date: encomenda.scheduled_date || undefined,
      city: encomenda.city,
      country: encomenda.country,
      state: encomenda.state,
      number: encomenda.number,
      additional_info: encomenda.additional_info,
      cep: encomenda.cep,
      paid_now: valorPago.toFixed(2),
      descount: desconto || "0.0",
      payment_type: formaPagamento,
      total_value: encomenda.total_value || "0.0",
      removed_packages: pacotesRemovidos,
      added_packages: pacotesAdicionados,
    
    });
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="md:fixed md:top-0 md:left-0 md:h-screen md:w-64 bg-black text-white border-r z-10">
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

      <main className="md:ml-64 h-full overflow-y-auto bg-[#fcf8f5] p-6 space-y-6">
        <h1 className="text-2xl font-bold font-primary text-black">
          {t.pagamento_conferencia}
        </h1>
        {carregando || !encomenda || !remetente || !destinatario ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
          </div>
        ) : (
          <>
            <section className="space-y-1">
              <h2 className="text-lg font-semibold">{t.remetente}</h2>
              <p>
                {remetente.name.toLocaleLowerCase()} - {remetente.email} -{" "}
                {formatarLinkWhatsapp(remetente.phoneNumber, { icon: true })}
              </p>
              <p className="text-sm text-gray-600">
                {remetente.addresses[0].city} - {remetente.addresses[0].state} -{" "}
                {remetente.addresses[0].cep}
              </p>
            </section>

            <section className="space-y-1">
              <h2 className="text-lg font-semibold">{t.destinatario}</h2>
              <p>
                {destinatario.name.toLowerCase()} - {destinatario.email} -{" "}
                {formatarLinkWhatsapp(destinatario.phoneNumber, { icon: true })}
              </p>
              <p className="text-sm text-gray-600">
                {destinatario.addresses[0].city} -{" "}
                {destinatario.addresses[0].state} -{" "}
                {destinatario.addresses[0].cep}
              </p>
            </section>

            <section className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{t.pacotes}</h2>
                <button
                  onClick={toggleTodos}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {pacotesSelecionados.length === encomenda.packages.length
                    ? t.desmarcar_todos
                    : t.selecionar_todos}
                </button>
              </div>
              <ul className="space-y-2">
                {encomenda.packages.map((p) => (
                  <li
                    key={p.id}
                    className="p-2 border rounded bg-white flex justify-between items-center"
                  >
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={estaSelecionado(p.id)}
                        onChange={() => togglePacote(p.id)}
                        className="mt-1"
                      />
                      <div>
                        📦 <strong>{p.description}</strong> - {p.weight}kg
                      </div>
                    </label>
                    <button
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => toggleRemoverPacote(p.id)}
                    >
                      {pacotesRemovidos.includes(p.id) ? t.desfazer : t.remover}
                    </button>
                  </li>
                ))}
              </ul>
              {pacotesAdicionados.map((p, idx) => (
                <li
                  key={`novo-${idx}`}
                  className="p-2 border rounded bg-orange/10 flex justify-between items-center"
                >
                  📦 <strong>{p.description}</strong> peso {p.weight} kg{" "}
                  <div>
                    Valor declarado <strong>R$ {p.declared_value} </strong>
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    (não salvo)
                  </span>
                </li>
              ))}
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
                  onChange={(e) =>
                    setStatusPacote(e.target.value as PacoteStatus)
                  }
                >
                  <option value="em_preparacao">
                    {t.status_em_preparacao}
                  </option>
                  <option value="em_transito">{t.status_em_transito}</option>
                  <option value="aguardando_retirada">
                    {t.status_aguardando_retirada}
                  </option>
                  <option value="entregue">{t.status_entregue}</option>
                  <option value="cancelada">{t.status_cancelada}</option>
                </select>
                <button
                  onClick={adicionarPacote}
                  className="px-4 py-2 bg-orange text-white rounded hover:opacity-90"
                >
                  {t.adicionar}
                </button>
              </div>
              {pacotesAdicionados.length > 0 && (
                <button
                  className="mt-4 px-4 py-2 bg-orange text-white rounded hover:opacity-90"
                  onClick={async () => {
                    if (!encomenda) return;

                    await orderService.atualizar(encomenda.id, {
                      payment_status: statusPagamento,
                      removed_packages: pacotesRemovidos,
                      from_account_id: encomenda.from_account_id,
                      to_account_id: encomenda.to_account_id,
                      status: encomenda.status || undefined,
                      is_express: encomenda.is_express,
                      scheduled_date: encomenda.scheduled_date || undefined,
                      city: encomenda.city,
                      country: encomenda.country,
                      state: encomenda.state,
                      number: encomenda.number,
                      additional_info: encomenda.additional_info ?? "",
                      cep: encomenda.cep,
                      paid_now: encomenda.paid_now || "0",
                      descount: encomenda.descount || "0",
                      payment_type: encomenda.payment_type || "a_vista",
                      total_value: encomenda.total_value || "0",
                      added_packages: pacotesAdicionados,
                    });

                    // Após salvar, recarrega os dados
                    carregar();

                    // Limpa os pacotes adicionados após o envio
                    setPacotesAdicionados([]);
                  }}
                >
                  {t.salvar_alteracoes || "Salvar alterações"}
                </button>
              )}
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold">
                {t.forma_pagamento_label}
              </h2>
              <select
                value={formaPagamento}
                onChange={(e) =>
                  setFormaPagamento(e.target.value as FormaPagamento)
                }
                className="p-2 border rounded w-full md:w-1/2"
              >
                <option value="a_vista">
                  {t.forma_pagamento_a_vista || "À vista"}
                </option>
                <option value="parcelado">
                  {t.forma_pagamento_parcelado || "Parcelado"}
                </option>
                <option value="na_retirada">
                  {t.forma_pagamento_na_retirada || "Na retirada"}
                </option>
              </select>
            </section>

            {formaPagamento === "parcelado" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t.valor_pago_agora}
                </label>
                <div className="max-w-sm">
                <DecimalMoneyInput
                    value={valorPagoInput}
                    onChange={(val) => setValorPagoInput(val)}
                    placeholder={t.valor_pago_agora}
                    decimalPlaces={2}
                  />
                </div>
               
              </div>
            )}

            <div>
              <button
                onClick={() => setMostrarMaisOpcoes(!mostrarMaisOpcoes)}
                className="text-blue-600 hover:underline text-sm"
              >
                {mostrarMaisOpcoes ? t.ocultar_opcoes : t.mais_opcoes}
              </button>
              {mostrarMaisOpcoes && (
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">
                    {t.desconto_label}
                  </label>
                <div className="max-w-sm">
                <DecimalMoneyInput
                    value={desconto}
                    onChange={(val) => setDesconto(val)}
                    placeholder={t.desconto_label}
                    decimalPlaces={2}
                  />
                </div>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-lg font-semibold">
                {t.valor_final}:{" "}
                <span className="text-green-700">
                  R$ {valorFinal.toFixed(2)}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                <strong>{t.status_do_pagamento}:</strong> {statusPagamento}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <button
                onClick={async () => {
                  await salvarPagamento();
                  await carregar();
                  // navigate("/admin/encomendas");
                }}
                className="px-6 py-3 bg-black text-white rounded hover:opacity-80 text-sm font-secondary"
              >
                {t.confirmar_salvar}
              </button>
              <button
                onClick={async () => {
                  navigate(`/admin/encomendas/${encomenda.id}/etiquetas`, {
                    state: { pacotesSelecionados },
                  });
                }}
                className="px-6 py-3 bg-orange text-white rounded hover:opacity-90 text-sm font-secondary"
              >
                {t.gerar_etiquetas}
              </button>
              <button
                onClick={() => navigate("/admin/encomendas")}
                className="px-6 py-3 bg-gray-300 text-black rounded hover:opacity-80 text-sm font-secondary"
              >
                {t.voltar_encomendas}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default EncomendaPagamento;
