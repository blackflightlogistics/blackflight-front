import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { paymentTypeToString } from "../../utils/utils";
import { useLanguage } from "../../context/useLanguage";


interface PaymentDonutChartProps {
  data: { payment_type: string; count: number }[];
}



const PaymentDonutChart = ({ data }: PaymentDonutChartProps) => {
  const { translations: t } = useLanguage();
  const colors = ["#2196F3", "#4CAF50", "#FFC107", "#E57373", "#BA68C8", "#FF7043"];
  const chartData = data.map((item, index) => ({
    id: index,
    value: item.count,
    color: colors[index % colors.length],
  }));
  return (
    <Card variant="outlined">
      <CardContent sx={{ minHeight: 440 }}> {/* altura fixa para igualar */}
        <Typography variant="subtitle1" gutterBottom>
          {t.formas_de_pagamentos}
        </Typography>

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
            height={300} // altura aumentada
          />
        </Box>

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
              <Typography variant="body2">{ paymentTypeToString(data[index].payment_type,t)}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
export default PaymentDonutChart;