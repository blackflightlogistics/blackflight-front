import { Bar } from "react-chartjs-2";
import { Remessa } from "../../services/remessaService";
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
  remessas: Remessa[];
}

function PesoPorRemessaChart({ remessas }: Props) {
  const data = {
    labels: remessas.map((r) => `#${r.id} - ${r.pais}`),
    datasets: [
      {
        label: "Peso Total (kg)",
        data: remessas.map((r) => r.pesoTotal),
        backgroundColor: "#0692F2",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Peso Total por Remessa</h2>
      <Bar data={data} />
    </div>
  );
}

export default PesoPorRemessaChart;
