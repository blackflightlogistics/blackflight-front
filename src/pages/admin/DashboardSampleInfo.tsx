import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import DashboardCards from "../../components/admin/DashboardCards";
import StatusCards from "../../components/admin/StatusCards";
import OrdersTable from "../../components/admin/OrdersTable";
import {
  dashboardService,
  DashboardData,
} from "../../services/dashboardService";
import { useLanguage } from "../../context/useLanguage";
import PaymentDonutChart from "./PaymentDonutChart";
// import RevenueBarChart from "./RevenueBarChart";
import CountryDonutChart from "./CountryDonutChart";
import RoutesMap from "./RoutesMap";
import OrdersCharts from "../../components/admin/OrdersChart copy";

const DashboardSampleInfo = () => {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [dados, setDados] = useState<DashboardData | null>(null);
  const { translations: t } = useLanguage();

  useEffect(() => {
    dashboardService.obterDados().then(setDados);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar fixa */}
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
        <h1 className="text-2xl font-primary font-bold mb-6">
          {t.sidebar_dashboard}
        </h1>

        {dados && (
          <>
            <DashboardCards
              totalOrders={dados.total_orders}
              totalAccounts={dados.total_accounts}
              faturamentoTotal={dados.get_total_revenue}
              entregasNoPrazo={dados.count_orders_delivered_on_time}
            />
            <div className="my-6 flex gap-6">
              <div className="flex-1 basis-2/3">
                <OrdersCharts data={dados.count_orders_grouped_by_month} />
              </div>
              <div className="flex-1 basis-1/3">
                <RoutesMap />
              </div>
            </div>
            <OrdersTable pedidos={dados.last_orders} />
            <StatusCards statusData={dados.count_orders_grouped_by_status} />
            <div className="flex flex-wrap gap-6 my-6">
              <div className="flex-1 min-w-[300px]">
                <PaymentDonutChart  data={dados.count_orders_grouped_by_payment_type}/>
              </div>
              {/* <div className="flex-1 min-w-[300px]">
                <RevenueBarChart />
              </div> */}
              <div className="flex-1 min-w-[300px]">
                <CountryDonutChart  data={dados.count_orders_grouped_by_country}/>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardSampleInfo;
