import { Card, CardContent, Typography, Box } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useLanguage } from "../../context/useLanguage";

interface OrdersChartProps {
  data?: { count: number; month_year: string }[]; // ❗ Torna data opcional
}

const OrdersCharts = ({ data }: OrdersChartProps) => {
  const { translations: t } = useLanguage();
  if (!data || data.length === 0) {
    return null; // Ou um loading placeholder
  }

  const mesesFormatados = data.map((item) => {
    const [ano, mes] = item.month_year.split("-");
    const nomesMeses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    return `${nomesMeses[parseInt(mes, 10) - 1]}/${ano.slice(2)}`;
  });

  const valores = data.map((item) => item.count);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          {t.pedidos_por_mes}
        </Typography>

        <Box mt={3}>
          <LineChart
            xAxis={[{ scaleType: "point", data: mesesFormatados }]}
            series={[
              {
                data: valores,
                area: true,
                color: "#FF9800",
              },
            ]}
            height={232}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrdersCharts;
