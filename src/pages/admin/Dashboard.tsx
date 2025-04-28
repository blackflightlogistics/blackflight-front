import Sidebar from "../../components/admin/Sidebar";
import DashboardCards from "../../components/admin/DashboardCards";
import OrdersChart from "../../components/admin/OrdersChart";
import StatusCards from "../../components/admin/StatusCards";
import OrdersTable from "../../components/admin/OrdersTable";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Fixa */}
      <Sidebar />

      {/* Conteúdo Scrollável */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#fcf7f1] p-6">

        <h1 className="text-2xl font-primary font-bold mb-6">Dashboard</h1>

        <DashboardCards />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <OrdersChart />
          {/* Você pode adicionar outro gráfico ou mapa aqui */}
        </div>

        <StatusCards />

        <OrdersTable />
      </div>
    </div>
  );
};

export default Dashboard;
