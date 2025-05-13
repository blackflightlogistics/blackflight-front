// import { FaUser, FaDollarSign, FaClock, FaShoppingCart } from "react-icons/fa";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { useLanguage } from "../../context/useLanguage";

interface DashboardCardsProps {
  totalOrders: number;
  totalAccounts: number;
}

const DashboardCards = ({ totalOrders, totalAccounts }: DashboardCardsProps) => {
  const { translations: t } = useLanguage();

  const cards = [
    {
      title: t.sidebar_clientes, // Ex: "Clientes"
      value: totalAccounts.toLocaleString(),
      icon: <FaUser className="text-orange" />,
      positive: true,
    },
    {
      title: t.sidebar_encomendas, // Ex: "Encomendas"
      value: totalOrders.toLocaleString(),
      icon: <FaShoppingCart className="text-orange" />,
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
            <h4 className="text-xs font-secondary text-gray-500">{card.title}</h4>
            <div className="bg-orange/10 p-2 rounded-full">{card.icon}</div>
          </div>
          <div className="text-xl font-bold font-primary text-black">{card.value}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
