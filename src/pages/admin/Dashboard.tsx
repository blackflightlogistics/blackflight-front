import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import DashboardCards from "../../components/admin/DashboardCards";
import OrdersChart from "../../components/admin/OrdersChart";
import StatusCards from "../../components/admin/StatusCards";
import OrdersTable from "../../components/admin/OrdersTable";
import { dashboardService, DashboardData } from "../../services/dashboardService";
import { useLanguage } from "../../context/useLanguage";

const Dashboard = () => {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [dados, setDados] = useState<DashboardData | null>(null);
  const { translations: t } = useLanguage();

  useEffect(() => {
    dashboardService.obterDados().then(setDados);
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="md:top-0 md:left-0 md:h-screen md:w-64 bg-black text-white border-r z-10">
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded"
          onClick={() => setSidebarAberta(true)}
        >
          ☰ {t.menu}
        </button>
        <Sidebar
          mobileAberta={sidebarAberta}
          onFechar={() => setSidebarAberta(false)}
        />
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#fcf7f1] pt-16 p-6">
        <h1 className="text-2xl font-primary font-bold mb-6">{t.sidebar_dashboard}</h1>

        {dados && (
          <>
            <DashboardCards
              totalOrders={dados.total_orders}
              totalAccounts={dados.total_accounts}
            />
            <div className="gap-6 my-6">
              <OrdersChart data={dados.count_orders_grouped_by_month} />
            </div>
            <StatusCards statusData={dados.count_orders_grouped_by_status} />
            <OrdersTable pedidos={dados.last_orders} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
