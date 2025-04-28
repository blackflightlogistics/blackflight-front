import Sidebar from "../../components/admin/Sidebar";
import DashboardCards from "../../components/admin/DashboardCards";
import OrdersChart from "../../components/admin/OrdersChart";
import StatusCards from "../../components/admin/StatusCards";
import OrdersTable from "../../components/admin/OrdersTable";
import { useState } from "react";

const Dashboard = () => {
    const [sidebarAberta, setSidebarAberta] = useState(false);
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Fixa */}
      {/* <Sidebar /> */}
      <div className=" md:top-0 md:left-0 md:h-screen md:w-64 bg-black text-white border-r z-10">
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded"
          onClick={() => setSidebarAberta(true)}
        >
          ☰ Menu
        </button>
        <Sidebar
          mobileAberta={sidebarAberta}
          onFechar={() => setSidebarAberta(false)}
        />
      </div>
      {/* Conteúdo Scrollável */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#fcf7f1] pt-16  p-6">

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
