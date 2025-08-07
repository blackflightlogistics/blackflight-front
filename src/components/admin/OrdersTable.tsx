
import { useLanguage } from "../../context/useLanguage";
import { Order } from "../../services/encomendaService";

interface OrdersTableProps {
  pedidos: Order[];
}

const statusColors: Record<string, string> = {
  entregue: "bg-green-100 text-green-700",
  em_transito: "bg-blue-100 text-blue-700",
  pendente: "bg-orange-100 text-orange-700",
  em_preparacao: "bg-yellow-100 text-yellow-700",
  atrasado: "bg-red-100 text-red-700",
};

const OrdersTable = ({ pedidos }: OrdersTableProps) => {
  const { translations: t } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-10">
      <h3 className="text-lg font-primary font-bold mb-4">{t.ultimos_pedidos ?? "Últimos Pedidos"}</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2">{t.codigo ?? "Código"}</th>
              <th className="p-2">{t.valor_total ?? "valor"}</th>
              <th className="p-2">{t.status ?? "Status"}</th>
              <th className="p-2">{t.origem ?? "Origem"}</th>
              <th className="p-2">{t.destino ?? "Destino"}</th>
              <th className="p-2">{t.data ?? "Data"}</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido, index) => {
              const statusKey = `status_${pedido.status}` as keyof typeof t;
              const statusLabel = t[statusKey] || pedido.status?.replace(/_/g, " ");

              return (
                <tr key={index} className="border-t">
                  <td className="p-2 font-semibold">{pedido.tracking_code}</td>
                  <td className="p-2">
                    {pedido.total_value
                      ? parseFloat(pedido.total_value).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "N/A"}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[pedido.status ?? ""] || "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                  <td className="p-2">
                    {pedido.from_account.adresses[0]?.city?.toLocaleLowerCase()} - {pedido.from_account.adresses[0]?.state?.toLocaleLowerCase()}
                  </td>
                  <td className="p-2">
                    {pedido.to_account.adresses[0]?.city?.toLocaleLowerCase()} - {pedido.to_account.adresses[0]?.state?.toLocaleLowerCase()}
                  </td>
                  <td className="p-2">
                    {new Date(pedido.inserted_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
