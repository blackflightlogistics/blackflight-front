import { BarChart } from "@mui/x-charts";
import { Box, Card, CardContent, Typography } from "@mui/material";

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const pago = [20000, 25000, 30000, 32000, 35000, 28000, 22000];
const pendente = [5000, 6000, 4000, 5000, 7000, 6000, 5000];
const cancelado = [3000, 2000, 1000, 1500, 3000, 2500, 2000];

const colors = {
  pago: "#64B5F6",
  pendente: "#FFD54F",
  cancelado: "#E57373",
};

const RevenueBarChart = () => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Valor Arrecadado por Status de Pagamento
          </Typography>

          <BarChart
            width={400}
            height={300}
            xAxis={[{ scaleType: "band", data: dias }]}
            series={[
              {
                data: pago,
                label: "Pago",
                stack: "total",
                color: colors.pago,
              },
              {
                data: pendente,
                label: "Pendente",
                stack: "total",
                color: colors.pendente,
              },
              {
                data: cancelado,
                label: "Cancelado",
                stack: "total",
                color: colors.cancelado,
              },
            ]}
            margin={{ bottom: 40 }}
          />

          {/* Legenda customizada abaixo */}
          <Box display="flex" justifyContent="center" gap={4} mt={2}>
            {[
              { label: "Pago", color: colors.pago },
              { label: "Pendente", color: colors.pendente },
              { label: "Cancelado", color: colors.cancelado },
            ].map((item) => (
              <Box key={item.label} display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "4px",
                    backgroundColor: item.color,
                  }}
                />
                <Typography variant="body2">{item.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RevenueBarChart;
