import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Encomenda } from "../../services/encomendaService";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  encomendas: Encomenda[];
}

export default function EncomendasPorStatusChart({ encomendas }: Props) {
  const statusLabels = [
    "em preparação",
    "em transito",
    "aguardando retirada",
    "entregue",
    "cancelada",
  ];

  const statusCount = statusLabels.map(
    (status) => encomendas.filter((e) => e.status === status).length
  );

  const data = {
    labels: statusLabels,
    datasets: [
      {
        label: "Quantidade de Encomendas",
        data: statusCount,
        backgroundColor: "#0250F4",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Encomendas por Status</h2>
      <Bar data={data} />
    </div>
  );
}
