import { FaUser, FaDollarSign, FaClock, FaShoppingCart } from "react-icons/fa";

const cards = [
  {
    title: "Total de Clientes",
    value: "1.842",
    icon: <FaUser className="text-orange" />,
    change: "+8,2%",
    positive: true,
  },
  {
    title: "Faturamento Total",
    value: "R$ 285.420",
    icon: <FaDollarSign className="text-orange" />,
    change: "+12,5% vs. mês anterior",
    positive: true,
  },
  {
    title: "Entregas no Prazo",
    value: "94,8%",
    icon: <FaClock className="text-orange" />,
    change: "-1,2% vs. semana anterior",
    positive: false,
  },
  {
    title: "Total de Pedidos",
    value: "3.764",
    icon: <FaShoppingCart className="text-orange" />,
    change: "+5,7% vs. mês anterior",
    positive: true,
  },
];

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-secondary text-gray-500">{card.title}</h4>
            <div className="bg-orange/10 p-2 rounded-full">
              {card.icon}
            </div>
          </div>
          <div className="text-xl font-bold font-primary text-black">{card.value}</div>
          <div className="text-xs mt-2 flex items-center">
            <span className={card.positive ? "text-green-500" : "text-red-500"}>
              {card.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
