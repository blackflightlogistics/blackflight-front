import { Pie } from "react-chartjs-2";
import { Remessa } from "../../services/remessaService";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  remessas: Remessa[];
}

function EncomendasPorPaisChart({ remessas }: Props) {
  const resumo: Record<string, number> = {};

  remessas.forEach((r) => {
    resumo[r.pais] = (resumo[r.pais] || 0) + r.encomendaIds.length;
  });

  const data = {
    labels: Object.keys(resumo),
    datasets: [
      {
        label: "Qtd de Encomendas",
        data: Object.values(resumo),
        backgroundColor: [
          "#0250F4",
          "#43BCFF",
          "#0692F2",
          "#E3E8F4",
          "#070D27",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false as const,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white p-3 rounded shadow w-full max-w-sm">
        <h2 className="text-base font-semibold mb-2 text-center">Encomendas por País</h2>
        <div className="h-48">
          <Pie data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default EncomendasPorPaisChart;
