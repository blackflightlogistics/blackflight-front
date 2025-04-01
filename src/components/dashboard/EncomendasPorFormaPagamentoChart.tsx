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

function EncomendasPorFormaPagamentoChart({ encomendas }: Props) {
  const formas = ["à vista", "parcelado", "na retirada"];
  const contagem = formas.map(
    (forma) =>
      encomendas.filter((e) => e.formaPagamento === forma).length
  );

  const data = {
    labels: formas,
    datasets: [
      {
        label: "Encomendas",
        data: contagem,
        backgroundColor: "#0250F4",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Encomendas por Forma de Pagamento</h2>
      <Bar data={data} />
    </div>
  );
}

export default EncomendasPorFormaPagamentoChart;
