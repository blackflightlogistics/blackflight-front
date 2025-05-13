import { useLanguage } from "../../context/useLanguage";
import { pacoteStatusToString } from "../../utils/utils";

interface StatusCardsProps {
  statusData: { status: string; count: number }[];
}

const statusColors: Record<string, string> = {
  em_preparacao: "bg-yellow-100 text-yellow-800",
  em_transito: "bg-blue-100 text-blue-800",
  entregue: "bg-green-100 text-green-800",
  cancelada: "bg-red-100 text-red-800",
};

const StatusCards = ({ statusData }: StatusCardsProps) => {
  const { translations: t } = useLanguage();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {statusData.map((status, index) => (
        <div
          key={index}
          className={`flex flex-col items-center justify-center rounded-lg p-6 ${
            statusColors[status.status] || "bg-gray-100 text-gray-800"
          } shadow`}
        >
          <div className="text-2xl font-bold font-primary">{status.count}</div>
          <div className="text-sm font-secondary mt-2">{pacoteStatusToString(status.status,t)}</div>
        </div>
      ))}
    </div>
  );
};

export default StatusCards;
