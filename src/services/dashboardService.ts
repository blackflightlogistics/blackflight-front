import api from "../api/api";
import { Account } from "./encomendaService";

export interface DashboardOrder {
  id: string;
  tracking_code: string;
  status: string;
  inserted_at: string;
  from_account: Account;
  to_account: Account;
  // Campos adicionais que vieram em `last_orders` (se quiser mapear):
  total_value?: string;
  total_weight?: string;
  payment_type?: string;
  payment_status?: string;
  scheduled_date?: string | null;
  is_express?: boolean;
}

export interface DashboardData {
  total_orders: number;
  total_accounts: number;
  count_orders_grouped_by_last_7_days: { count: number; date: string }[];
  count_orders_grouped_by_month: { count: number; month_year: string }[];
  count_orders_grouped_by_status: { count: number; status: string }[];
  last_orders: DashboardOrder[];

  // Novos campos:
  count_orders_delivered_on_time: number;
  count_orders_grouped_by_country: { country: string; count: number }[];
  count_orders_grouped_by_payment_type: { payment_type: string; count: number }[];
  count_orders_grouped_by_year: { year: string; count: number }[];
  get_revenue_grouped_by_month: { month_start: string; total_revenue: number }[];
  get_revenue_grouped_by_week_last_2_months: { week_start: string; total_revenue: number }[];
  get_total_revenue: number;
}

export const dashboardService = {
  async obterDados(): Promise<DashboardData> {
    const response = await api.get<DashboardData>("/dashbord");
    return response.data;
  },
};
