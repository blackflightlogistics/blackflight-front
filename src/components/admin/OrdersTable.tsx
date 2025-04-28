const pedidos = [
    {
      codigo: "E-1001",
      status: "Em trânsito",
      origem: "São Paulo - SP",
      destino: "Rio de Janeiro - RJ",
      data: "22/04/2025",
    },
    {
      codigo: "E-1002",
      status: "Entregue",
      origem: "Campinas - SP",
      destino: "Belo Horizonte - MG",
      data: "21/04/2025",
    },
    {
      codigo: "E-1003",
      status: "Pendente",
      origem: "Curitiba - PR",
      destino: "São Paulo - SP",
      data: "23/04/2025",
    },
    {
      codigo: "E-1004",
      status: "Atrasado",
      origem: "Salvador - BA",
      destino: "Fortaleza - CE",
      data: "20/04/2025",
    },
  ];
  
  const statusColors = {
    "Entregue": "bg-green-100 text-green-700",
    "Em trânsito": "bg-blue-100 text-blue-700",
    "Pendente": "bg-orange-100 text-orange-700",
    "Atrasado": "bg-red-100 text-red-700",
  };
  
  const OrdersTable = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-10">
        <h3 className="text-lg font-primary font-bold mb-4">Últimos Pedidos</h3>
  
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="p-2">Código</th>
                <th className="p-2">Status</th>
                <th className="p-2">Origem</th>
                <th className="p-2">Destino</th>
                <th className="p-2">Data</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2 font-semibold">{pedido.codigo}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[pedido.status as keyof typeof statusColors]}`}
                    >
                      {pedido.status}
                    </span>
                  </td>
                  <td className="p-2">{pedido.origem}</td>
                  <td className="p-2">{pedido.destino}</td>
                  <td className="p-2">{pedido.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default OrdersTable;
  