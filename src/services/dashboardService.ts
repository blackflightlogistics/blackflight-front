import api from "../api/api";


export interface DashboardOrder {
  id: string;
  tracking_code: string;
  status: string;
  inserted_at: string;
  from_account: {
    name: string;
    adresses: {
      city: string;
      state: string;
    }[];
  };
  to_account: {
    name: string;
    adresses: {
      city: string;
      state: string;
    }[];
  };
}

export interface DashboardData {
  count_orders_grouped_by_last_7_days: { count: number; date: string }[];
  count_orders_grouped_by_month: { count: number; month_year: string }[];
  count_orders_grouped_by_status: { count: number; status: string }[];
  last_orders: DashboardOrder[];
  total_accounts: number;
  total_orders: number;
}

export const dashboardService = {
  async obterDados(): Promise<DashboardData> {
    const response = await api.get<DashboardData>("/dashbord");
    return response.data;
  }
};
