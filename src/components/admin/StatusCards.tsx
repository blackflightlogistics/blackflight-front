const statusCards = [
    {
      label: "Entregues",
      value: 1.235,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Em trânsito",
      value: 542,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Pendentes",
      value: 128,
      color: "bg-orange-100 text-orange-700",
    },
    {
      label: "Atrasados",
      value: 32,
      color: "bg-red-100 text-red-700",
    },
  ];
  
  const StatusCards = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {statusCards.map((status, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center rounded-lg p-6 ${status.color} shadow`}
          >
            <div className="text-2xl font-bold font-primary">{status.value}</div>
            <div className="text-sm font-secondary mt-2">{status.label}</div>
          </div>
        ))}
      </div>
    );
  };
  
  export default StatusCards;
  