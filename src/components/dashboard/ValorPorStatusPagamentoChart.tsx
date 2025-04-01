import { Bar } from "react-chartjs-2";
import { Encomenda } from "../../services/encomendaService";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  encomendas: Encomenda[];
}

function ValorPorStatusPagamentoChart({ encomendas }: Props) {
  const status = ["pago", "parcial", "pendente"];

  const valores = status.map((s) => {
    return encomendas
      .filter((e) => e.statusPagamento === s)
      .reduce((total, e) => total + (e.valorPago || 0), 0);
  });

  const data = {
    labels: status,
    datasets: [
      {
        label: "Valor Arrecadado (R$)",
        data: valores,
        backgroundColor: "#43BCFF",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Valor Arrecadado por Status de Pagamento</h2>
      <Bar data={data} />
    </div>
  );
}

export default ValorPorStatusPagamentoChart;
