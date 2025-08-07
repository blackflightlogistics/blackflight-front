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
import OrderFiltersComponent from "../../components/admin/OrderFilters";
import { Order, OrderFilters, orderService } from "../../services/encomendaService";

const Dashboard = () => {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [dados, setDados] = useState<DashboardData | null>(null);
  const { translations: t } = useLanguage();
  const [carregando, setCarregando] = useState(true);
  const [filtros, setFiltros] = useState<OrderFilters>({});
  const limparFiltros = () => {
    setFiltros({});
    carregar();
  };
  const carregar = async (filtrosAplicados?: OrderFilters) => {
    setCarregando(true);
    const [encomendasData] = await Promise.all([orderService.listar(false, filtrosAplicados)]);
    setEncomendas(encomendasData);
    setCarregando(false);
  };
  const [encomendas, setEncomendas] = useState<Order[]>([]);
  const aplicarFiltros = () => {
    const filtrosFormatados: OrderFilters = { ...filtros };
    
    // Converter datas para formato ISO 8601 com timezone UTC
    if (filtros.initial_date) {
      const dataInicial = new Date(filtros.initial_date);
      dataInicial.setUTCHours(0, 0, 0, 0); // Início do dia
      filtrosFormatados.initial_date = dataInicial.toISOString();
    }
    
    if (filtros.final_date) {
      const dataFinal = new Date(filtros.final_date);
      dataFinal.setUTCHours(23, 59, 59, 999); // Final do dia
      filtrosFormatados.final_date = dataFinal.toISOString();
    }
    
    carregar(filtrosFormatados);
  };

  useEffect(() => {
    setCarregando(true);
    dashboardService
      .obterDados()
      .then(setDados)
      .finally(() => setCarregando(false));
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
      
        {carregando ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
          </div>
        ) : !dados ? (
          <p className="text-gray-600">Nenhum dado disponível</p>
        ) : (
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
            <OrderFiltersComponent
              filtros={filtros}
              onFiltrosChange={setFiltros}
              onAplicarFiltros={aplicarFiltros}
              onLimparFiltros={limparFiltros}
            />
            <OrdersTable pedidos={encomendas} />
            <StatusCards statusData={dados.count_orders_grouped_by_status} />
            <div className="flex flex-wrap gap-6 my-6">
              <div className="flex-1 min-w-[300px]">
                <PaymentDonutChart
                  data={dados.count_orders_grouped_by_payment_type}
                />
              </div>
              {/* <div className="flex-1 min-w-[300px]">
                <RevenueBarChart />
              </div> */}
              <div className="flex-1 min-w-[300px]">
                <CountryDonutChart
                  data={dados.count_orders_grouped_by_country}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
