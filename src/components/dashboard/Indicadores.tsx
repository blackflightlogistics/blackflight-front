import { Encomenda } from "../../services/encomendaService";
import { Cliente } from "../../services/clienteService";
import { Remessa } from "../../services/remessaService";

type Props = {
  encomendas: Encomenda[];
  clientes: Cliente[];
  remessas: Remessa[];
};

export default function Indicadores({ encomendas, clientes, remessas }: Props) {
  const totalEncomendas = encomendas.length;
  const totalClientes = clientes.length;
  const totalRemessas = remessas.length;

  const totalPago = encomendas.reduce((total, e) => total + (e.valorPago || 0), 0);
  const totalPendente = encomendas.reduce((total, e) => {
    if (e.statusPagamento === "pendente" || e.statusPagamento === "parcial") {
      return total + ((e.valorTotal || 0) - (e.valorPago || 0));
    }
    return total;
  }, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-sm text-gray-600">Encomendas</p>
        <p className="text-2xl font-bold">{totalEncomendas}</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-sm text-gray-600">Clientes</p>
        <p className="text-2xl font-bold">{totalClientes}</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-sm text-gray-600">Remessas</p>
        <p className="text-2xl font-bold">{totalRemessas}</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-sm text-gray-600">Total Arrecadado</p>
        <p className="text-2xl font-bold text-green-600">R$ {totalPago.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-sm text-gray-600">Pendente de Pagamento</p>
        <p className="text-2xl font-bold text-red-600">R$ {totalPendente.toFixed(2)}</p>
      </div>
    </div>
  );
}
