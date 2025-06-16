import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useLanguage } from "../../context/useLanguage";

interface CountryDonutChartProps {
  data: { country: string; count: number }[];
}

const CountryDonutChart = ({ data }: CountryDonutChartProps) => {
  const { translations: t } = useLanguage();
  // Definindo cores fixas (pode adicionar mais se quiser)
  const colors = ["#2196F3", "#4CAF50", "#FFC107", "#E57373", "#BA68C8", "#FF7043"];

  // Preparando os dados para o PieChart
  const chartData = data.map((item, index) => ({
    id: index,
    value: item.count,
    color: colors[index % colors.length],
  }));

  return (
    <Card variant="outlined">
      <CardContent sx={{ minHeight: 440 }}> {/* altura fixa para igualar visualmente */}
        <Typography variant="subtitle1" gutterBottom>
          {t.pedidos_por_pais}
        </Typography>

        {/* Gráfico */}
        <Box display="flex" justifyContent="center" mt={2}>
          <PieChart
            series={[
              {
                innerRadius: 40,
                outerRadius: 80,
                paddingAngle: 5,
                cornerRadius: 5,
                data: chartData,
              },
            ]}
            width={250}
            height={300} // mesma altura que o outro
          />
        </Box>

        {/* Legenda abaixo do gráfico */}
        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          gap={2}
          mt={2}
        >
          {chartData.map((item, index) => (
            <Box
              key={item.id}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: item.color,
                }}
              />
              <Typography variant="body2">{data[index].country}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CountryDonutChart;
