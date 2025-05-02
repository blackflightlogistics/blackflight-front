// src/services/encomendaService.ts
import api from "../api/api";

export type FormaPagamento = "a_vista" | "parcelado" | "na_retirada";
export type PacoteStatus =
  |"em_preparacao"
  | "em_transito"
  | "aguardando_retirada"
  | "entregue"
  | "cancelada";
export type EncomendaStatus =
  |  "em_preparacao"
  | "em_transito"
  | "aguardando_retirada"
  | "entregue"
  | "cancelada";

export interface Account {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  inserted_at: string;
  country: string;
  cep: string;
  city: string;
  state: string;
  number: string;
}

export interface Package {
  id: string;
  description: string;
  weight: string;
  declared_value: string;
  status: string;
  inserted_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  from_account_id: string;
  to_account_id: string;
  from_account: Account;
  to_account: Account;
  status: string | null;
  is_express: boolean;
  scheduled_date: string | null;
  shipment_id: string | null;
  inserted_at: string;
  updated_at: string;
  packages: Package[];

  // Novos campos
  total_value: string | null;
  descount: string | null;
  paid_now: string | null;
  payment_type: string | null;
}

export interface CreateOrderPayload {
  from_account_id: string;
  to_account_id: string;
  status?: string;
  is_express: boolean;
  scheduled_date?: string;
  packages: {
    description: string;
    weight: string;
    status: string;
    declared_value: string;
  }[];
}

export const orderService = {
  listar: async (): Promise<Order[]> => {
    const response = await api.get<{ data: Order[] }>("/orders");
    return response.data.data;
  },

  buscarPorId: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  adicionar: async (orderData: CreateOrderPayload): Promise<Order> => {
    const response = await api.post<Order>("/orders", orderData);
    return response.data;
  },
};
