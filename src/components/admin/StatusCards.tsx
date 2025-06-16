import { JSX } from "react";
import { useLanguage } from "../../context/useLanguage";
import { pacoteStatusToString } from "../../utils/utils";
import { CheckCircle, LocalShipping, AccessTime, ErrorOutline } from "@mui/icons-material";

interface StatusCardsProps {
  statusData: {
    status: string;
    count: number;
    extra?: string; 
  }[];
}

const statusConfig: Record<string, { bg: string; text: string; icon: JSX.Element;  extraColor: string }> = {
  entregue: {
    bg: "bg-green-100",
    text: "text-green-800",
    icon: <CheckCircle className="text-green-400" />,
    extraColor: "text-green-700",
  },
  em_transito: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    icon: <LocalShipping className="text-blue-400" />,
    extraColor: "text-blue-600",
  },
  em_preparacao: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    icon: <AccessTime className="text-yellow-500" />,
    extraColor: "text-yellow-700",
  },
  cancelada: {
    bg: "bg-red-100",
    text: "text-red-800",
    icon: <ErrorOutline className="text-red-400" />,
    extraColor: "text-red-600",
  },
};

const StatusCards = ({ statusData }: StatusCardsProps) => {
  const { translations: t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-6 mt-8">
      {statusData.map((status, index) => {
        const config = statusConfig[status.status] || {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: null,
          extra: "",
          extraColor: "text-gray-600",
        };

        return (
          <div
            key={index}
            className={`relative flex-1 min-w-[250px] max-w-[300px] rounded-lg p-6 shadow ${config.bg} ${config.text}`}
          >
            {/* Ícone no canto superior direito */}
            <div className="absolute top-4 right-4">{config.icon}</div>

            {/* Título */}
            <div className="text-sm font-secondary mb-1">
              {pacoteStatusToString(status.status, t)}
            </div>

            {/* Quantidade */}
            <div className="text-2xl font-bold font-primary">{status.count}</div>

          </div>
        );
      })}
    </div>
  );
};

export default StatusCards;
