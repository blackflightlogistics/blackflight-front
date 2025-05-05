import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { clienteService, Cliente } from "../../services/clienteService";
import {
  orderService,
  Order,
  FormaPagamento,
} from "../../services/encomendaService";

function EncomendaPagamento() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const togglePacote = (id: string) => {
    setPacotesSelecionados((prev) =>
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

  useEffect(() => {
    if (!id) return;

    const carregar = async () => {
      const encomendaEncontrada = await orderService.buscarPorId(id);
      console.log("Encomenda encontrada:", encomendaEncontrada);
      setEncomenda(encomendaEncontrada);
      // setFormaPagamento(encomendaEncontrada.formaPagamento || "à vista");
      setFormaPagamento( "a_vista");
      setPacotesSelecionados(encomendaEncontrada.packages.map((p) => p.id));

      const remetente = await clienteService.buscarPorId(encomendaEncontrada.from_account_id);
      const destinatario = await clienteService.buscarPorId(encomendaEncontrada.to_account_id);

      setRemetente(remetente);
      setDestinatario(destinatario);
    };

    carregar();
  }, [id]);

  if (!encomenda || !remetente || !destinatario) {
    return <p className="p-6">Carregando detalhes...</p>;
  }

  // const valorBase = encomenda.valorTotal || 0;
  const valorBase = 0;
  const valorDesconto = desconto ? parseFloat(desconto) : 0;
  const valorFinal = Math.max(0, valorBase - valorDesconto);
  const valorPago =
    formaPagamento === "a_vista" ? valorFinal : parseFloat(valorPagoInput) || 0;

  const statusPagamento =
    valorPago >= valorFinal ? "pago" : valorPago > 0 ? "parcial" : "pendente";

  const salvarPagamento = async () => {
    // await orderService.atualizar({
    //   ...encomenda,
    //   formaPagamento,
    //   valorPago,
    //   statusPagamento,
    //   valorTotal: valorFinal,
    // });

    navigate("/admin/encomendas");
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Sidebar fixa */}
      <div className="md:fixed md:top-0 md:left-0 md:h-screen md:w-64 bg-black text-white border-r z-10">
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded"
          onClick={() => setSidebarAberta(true)}
        >
          ☰ Menu
        </button>
        <Sidebar mobileAberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} />
      </div>

      {/* Conteúdo principal */}
      <main className="md:ml-64 h-full overflow-y-auto bg-[#fcf8f5] p-6 space-y-6">
        <h1 className="text-2xl font-bold font-primary text-black">Conferência de Pagamento</h1>

        {/* Remetente */}
        <section className="space-y-1">
          <h2 className="text-lg font-semibold">Remetente</h2>
          <p>
            {remetente.name} - {remetente.email} - {remetente.phoneNumber}
          </p>
          <p className="text-sm text-gray-600">{remetente.addresses[0].city} - {remetente.addresses[0].state} - {remetente.addresses[0].zipCode}</p>
        </section>

        {/* Destinatário */}
        <section className="space-y-1">
          <h2 className="text-lg font-semibold">Destinatário</h2>
          <p>
            {destinatario.name} - {destinatario.email} - {destinatario.phoneNumber}
          </p>
          <p className="text-sm text-gray-600">{destinatario.addresses[0].city} - {destinatario.addresses[0].state} - {destinatario.addresses[0].zipCode}</p>
        </section>

        {/* Pacotes */}
        <section className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Pacotes</h2>
            <button
              onClick={toggleTodos}
              className="text-sm text-blue-600 hover:underline"
            >
              {pacotesSelecionados.length === encomenda.packages.length
                ? "Desmarcar todos"
                : "Selecionar todos"}
            </button>
          </div>
          <ul className="space-y-2">
            {encomenda.packages.map((p) => (
              <li key={p.id} className="p-2 border rounded bg-white">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={estaSelecionado(p.id)}
                    onChange={() => togglePacote(p.id)}
                    className="mt-1"
                  />
                  <div>
                    📦 <strong>{p.description}</strong> - {p.weight}kg
                    aqui temos problemas 
                    <br />
                    {/* 💰 R$ {p.valorCalculado?.toFixed(2)} */}
                    
                    {/* {p.valorDeclarado && (
                      <span className="ml-2 text-sm">
                        🛡️ Seguro: R$ {p.valorDeclarado.toFixed(2)}
                      </span>
                    )} */}
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </section>

        {/* Forma de Pagamento */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Forma de Pagamento</h2>
          <select
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
            className="p-2 border rounded w-full md:w-1/2"
          >
            <option value="à vista">À vista</option>
            <option value="parcelado">Parcelado</option>
            <option value="na retirada">Na retirada</option>
          </select>
        </section>

        {formaPagamento === "parcelado" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Valor pago agora (R$)
            </label>
            <input
              type="number"
              className="p-2 border rounded w-full md:w-1/2"
              value={valorPagoInput}
              onChange={(e) => setValorPagoInput(e.target.value)}
            />
          </div>
        )}

        {/* Mais opções */}
        <div>
          <button
            onClick={() => setMostrarMaisOpcoes(!mostrarMaisOpcoes)}
            className="text-blue-600 hover:underline text-sm"
          >
            {mostrarMaisOpcoes ? "Ocultar opções" : "Mais opções"}
          </button>
          {mostrarMaisOpcoes && (
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">
                Desconto (R$)
              </label>
              <input
                type="number"
                className="p-2 border rounded w-full md:w-1/2"
                value={desconto}
                onChange={(e) => setDesconto(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Totais */}
        <div className="mt-4 space-y-1">
          <p className="text-lg font-semibold">
            Valor final:{" "}
            <span className="text-green-700">R$ {valorFinal.toFixed(2)} falta essa info</span>
          </p>
          <p className="text-sm text-gray-700">
            <strong>Status do pagamento:</strong> {statusPagamento} falta essa info
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <button
            onClick={salvarPagamento}
            className="px-6 py-3 bg-black text-white rounded hover:opacity-80 text-sm font-secondary"
          >
            Confirmar e Salvar
          </button>
          <button
            onClick={() =>
              navigate(`/admin/encomendas/${encomenda.id}/etiquetas`, {
                state: { pacotesSelecionados },
              })
            }
            className="px-6 py-3 bg-orange text-white rounded hover:opacity-90 text-sm font-secondary"
          >
            Gerar Etiquetas
          </button>
          <button
            onClick={() => navigate("/admin/encomendas")}
            className="px-6 py-3 bg-gray-300 text-black rounded hover:opacity-80 text-sm font-secondary"
          >
            Voltar para Encomendas
          </button>
        </div>
      </main>
    </div>
  );
}

export default EncomendaPagamento;
