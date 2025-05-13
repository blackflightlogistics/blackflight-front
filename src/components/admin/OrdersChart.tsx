import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useLanguage } from "../../context/useLanguage";

interface OrdersChartProps {
  data: { count: number; month_year: string }[];
}

const OrdersChart = ({ data }: OrdersChartProps) => {
  const { translations: t } = useLanguage();

  const formattedData = data.map((item) => ({
    name: item.month_year,
    pedidos: item.count,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-primary font-bold mb-4">{t.etiqueta_titulo}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="pedidos" stroke="#0692F2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersChart;
