import { useLanguage } from "../../context/useLanguage";
import { Avatar, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalMallIcon from "@mui/icons-material/LocalMall";

interface DashboardCardsProps {
  totalOrders: number;
  totalAccounts: number;
  faturamentoTotal: number;
  entregasNoPrazo?: number; // Opcional, se quiser mostrar
}

const DashboardCards = ({
  totalOrders,
  totalAccounts,
  faturamentoTotal,
  entregasNoPrazo, // Exemplo fixo, pode ser dinâmico
}: DashboardCardsProps) => {
  const { translations: t } = useLanguage();

  const cards = [
    {
      title: t.total_de_clientes, // Ex: "Clientes"
      value: totalAccounts.toLocaleString(),
      icon: <PeopleIcon />,

      positive: true,
    },
    {
      title: t.total_de_encomendas,
      value: totalOrders.toLocaleString(),
      icon: <LocalMallIcon />,

      positive: true,
    },
    {
      title: t.faturamento_total,
      value: faturamentoTotal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "EUR",
      }),
      icon: <AttachMoneyIcon />,

      positive: false,
    },
    {
      title: t.entregues_no_prazo,
      value: entregasNoPrazo, // Exemplo fixo, pode ser dinâmico
      icon: <AccessTimeIcon />,

      positive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-secondary text-gray-500">
              {card.title}
            </h4>
            <Avatar sx={{ bgcolor: "#FFE7D5", width: 28, height: 28 }}>
              {card.icon}
            </Avatar>
          </div>
          <Typography variant="h5" gutterBottom>
            <div className="text-xl  font-primary text-black">{card.value}</div>
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
