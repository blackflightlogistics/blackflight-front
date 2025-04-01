import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { Encomenda, encomendaService } from "../../services/encomendaService";
import { clienteService, Cliente } from "../../services/clienteService";
import { remessaService, Remessa } from "../../services/remessaService";
import Indicadores from "../../components/dashboard/Indicadores";
import EncomendasPorStatusChart from "../../components/dashboard/EncomendasPorStatusChart";
import EncomendasPorFormaPagamentoChart from "../../components/dashboard/EncomendasPorFormaPagamentoChart";
import ValorPorStatusPagamentoChart from "../../components/dashboard/ValorPorStatusPagamentoChart";
import PesoPorRemessaChart from "../../components/dashboard/PesoPorRemessaChart";
import EncomendasPorPaisChart from "../../components/dashboard/EncomendasPorPaisChart";

function Dashboard() {
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [remessas, setRemessas] = useState<Remessa[]>([]);

  useEffect(() => {
    const carregar = async () => {
      const [encomendasData, clientesData, remessasData] = await Promise.all([
        encomendaService.listar(),
        clienteService.listar(),
        remessaService.listar(),
      ]);
      setEncomendas(encomendasData);
      setClientes(clientesData);
      setRemessas(remessasData);
    };
    carregar();
  }, []);

  const totalEncomendas = encomendas.length;
  const totalClientes = clientes.length;
  const totalValorRecebido = encomendas.reduce(
    (soma, e) => soma + (e.valorPago || 0),
    0
  );

  const statusEncomendas = {
    "em preparação": 0,
    "em transito": 0,
    "aguardando retirada": 0,
    entregue: 0,
    cancelada: 0,
  };

  const statusPagamento = {
    pago: 0,
    parcial: 0,
    pendente: 0,
  };

  encomendas.forEach((e) => {
    statusEncomendas[e.status]++;
    if (e.statusPagamento) {
      statusPagamento[e.statusPagamento]++;
    }
  });

  const statusRemessas = {
    aberta: 0,
    fechada: 0,
    enviada: 0,
  };

  remessas.forEach((r) => {
    statusRemessas[r.status]++;
  });

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* Indicadores aqui */}
        <Indicadores
          encomendas={encomendas}
          clientes={clientes}
          remessas={remessas}
        />

        {/* Coloque o gráfico abaixo */}
        <EncomendasPorStatusChart encomendas={encomendas} />

        <EncomendasPorPaisChart remessas={remessas} />

        <EncomendasPorFormaPagamentoChart encomendas={encomendas} />

        <ValorPorStatusPagamentoChart encomendas={encomendas} />
        <PesoPorRemessaChart remessas={remessas} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total de Encomendas</h2>
            <p className="text-3xl">{totalEncomendas}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total de Clientes</h2>
            <p className="text-3xl">{totalClientes}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Valor Recebido</h2>
            <p className="text-3xl text-green-600">
              R$ {totalValorRecebido.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">
              Encomendas por Status
            </h2>
            <ul className="space-y-1">
              {Object.entries(statusEncomendas).map(([status, count]) => (
                <li key={status}>
                  <strong>{status}:</strong> {count}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Status de Pagamento</h2>
            <ul className="space-y-1">
              {Object.entries(statusPagamento).map(([status, count]) => (
                <li key={status}>
                  <strong>{status}:</strong> {count}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Remessas por Status</h2>
            <ul className="space-y-1">
              {Object.entries(statusRemessas).map(([status, count]) => (
                <li key={status}>
                  <strong>{status}:</strong> {count}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
