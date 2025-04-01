import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { encomendaService, Encomenda } from "../../services/encomendaService";
import { clienteService, Cliente } from "../../services/clienteService";

function ConferenciaPagamento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [encomenda, setEncomenda] = useState<Encomenda | null>(null);
  const [remetente, setRemetente] = useState<Cliente | null>(null);
  const [destinatario, setDestinatario] = useState<Cliente | null>(null);
  const [formaPagamento, setFormaPagamento] = useState("avista");
  const [mostrarMaisOpcoes, setMostrarMaisOpcoes] = useState(false);
  const [desconto, setDesconto] = useState(0);

  useEffect(() => {
    if (!id) return;

    encomendaService.buscarPorId(Number(id)).then((dados) => {
      setEncomenda(dados);

      clienteService.buscarPorId(dados.remetenteId).then(setRemetente);
      clienteService.buscarPorId(dados.destinatarioId).then(setDestinatario);
    });
  }, [id]);

  if (!encomenda || !remetente || !destinatario) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">Carregando...</main>
      </div>
    );
  }

  const totalSemDesconto = encomenda.valorTotal || 0;
  const totalComDesconto = Math.max(totalSemDesconto - desconto, 0);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold">Conferência de Pagamento</h1>

        {/* Dados do cliente */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Remetente</h2>
          <p>
            <strong>{remetente.nome}</strong><br />
            {remetente.endereco}
          </p>
          <h2 className="text-lg font-semibold mt-4 mb-2">Destinatário</h2>
          <p>
            <strong>{destinatario.nome}</strong><br />
            {destinatario.endereco}
          </p>
        </section>

        {/* Pacotes */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Pacotes</h2>
          <ul className="space-y-2">
            {encomenda.pacotes.map((p) => (
              <li key={p.id} className="p-2 border rounded bg-white">
                📦 <strong>{p.descricao}</strong> - {p.peso}kg<br />
                💰 R$ {p.valorCalculado?.toFixed(2)}{" "}
                {p.valorDeclarado && (
                  <span className="ml-2 text-sm">
                    🛡️ Seguro: R$ {p.valorDeclarado.toFixed(2)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Valor total */}
        <section>
          <p className="text-lg font-semibold">
            Valor total:{" "}
            <span className="text-green-700">
              R$ {totalComDesconto.toFixed(2)}
            </span>
            {desconto > 0 && (
              <span className="text-sm text-gray-500 ml-2 line-through">
                R$ {totalSemDesconto.toFixed(2)}
              </span>
            )}
          </p>
        </section>

        {/* Forma de pagamento */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Forma de Pagamento</h2>
          <div className="flex flex-col gap-2">
            <label>
              <input
                type="radio"
                name="pagamento"
                value="avista"
                checked={formaPagamento === "avista"}
                onChange={(e) => setFormaPagamento(e.target.value)}
              />{" "}
              À vista
            </label>
            <label>
              <input
                type="radio"
                name="pagamento"
                value="parcelado"
                checked={formaPagamento === "parcelado"}
                onChange={(e) => setFormaPagamento(e.target.value)}
              />{" "}
              Parcelado (envio + retirada)
            </label>
            <label>
              <input
                type="radio"
                name="pagamento"
                value="retirada"
                checked={formaPagamento === "retirada"}
                onChange={(e) => setFormaPagamento(e.target.value)}
              />{" "}
              Total na retirada
            </label>
          </div>
        </section>

        {/* Mais opções */}
        <section>
          <button
            className="text-blue-600 text-sm hover:underline"
            onClick={() => setMostrarMaisOpcoes(!mostrarMaisOpcoes)}
          >
            {mostrarMaisOpcoes ? "Ocultar opções" : "Mais opções"}
          </button>

          {mostrarMaisOpcoes && (
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">
                Desconto aplicado (R$)
              </label>
              <input
                type="number"
                className="p-2 border rounded w-40"
                value={desconto}
                min={0}
                onChange={(e) => setDesconto(parseFloat(e.target.value) || 0)}
              />
            </div>
          )}
        </section>

        {/* Botão de finalizar */}
        <button
          className="mt-6 px-6 py-3 bg-black text-white rounded hover:opacity-90"
          onClick={() => {
            alert("Pagamento salvo (simulação)");
            navigate("/admin/encomendas");
          }}
        >
          Finalizar pagamento
        </button>
      </main>
    </div>
  );
}

export default ConferenciaPagamento;
