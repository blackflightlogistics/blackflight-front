// src/services/encomendaService.ts
import api from "../api/api";
import { Address, Cliente } from "./clienteService";

export type FormaPagamento = "a_vista" | "parcelado" | "na_retirada";
export type PacoteStatus =
  | "em_preparacao"
  | "em_transito"
  | "aguardando_retirada"
  | "entregue"
  | "cancelada";
export type EncomendaStatus =
  | "em_preparacao"
  | "em_transito"
  | "aguardando_retirada"
  | "entregue"
  | "cancelada";

export type EncomendaPagamentoStatus =
  | "pago"
  | "parcial"
  | "pendente"
  | "cancelado";

export interface Account {
  id: string;
  name: string;
  email: string;
  street: string;
  neighborhood: string;
  phone_number: string;
  inserted_at: string;
  country: string;
  cep: string;
  city: string;
  state: string;
  number: string;
  adresses: Address[];
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
  payment_status: string | null;
  from_account: Cliente;
  to_account: Cliente;
  status: string | null;
  is_express: boolean;
  scheduled_date: string | null;
  shipment_id: string | null;
  inserted_at: string;
  updated_at: string;
  packages: Package[];
  total_value: string | null;
  descount: string | null;
  paid_now: string | null;
  payment_type: string | null;
  neighborhood: string;
  street: string;
  city: string;
  state: string;
  country: string;
  number: string;
  additional_info: string;
  zip_code: string;
  cep: string;
  tracking_code: string | null;
  security_code: string | null;
}

export interface CreateOrderPayload {
  from_account_id: string;
  to_account_id: string;
  status?: string;
  is_express: boolean;
  scheduled_date?: string;
  city: string;
  state: string;
  country: string;
  number: string;
  additional_info: string;
  cep: string;
  paid_now: string;
  descount: string;
  payment_type: string;
  total_value: string;
  packages: {
    description: string;
    weight: string;
    status: string;
    declared_value: string;
  }[];
}

export interface UpdateOrderPayload {
  from_account_id: string;
  to_account_id: string;
  status?: string;
  is_express: boolean;
  scheduled_date?: string;
  city: string;
  state: string;
  country: string;
  number: string;
  additional_info: string;
  cep: string;
  paid_now: string;
  descount: string;
  payment_type: string;
  payment_status: EncomendaPagamentoStatus;
  total_value: string;
  added_packages?: {
    description: string;
    weight: string;
    status: string;
    declared_value: string;
  }[];
  removed_packages?: string[];
}
export const orderService = {
  listar: async (forShipment?: boolean): Promise<Order[]> => {
    const params = forShipment
      ? { filter: JSON.stringify({ for_shipment: "true" }) }
      : {};

    const response = await api.get<{ data: Order[] }>("/orders", { params });
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
  atualizar: async (orderId: string, data: UpdateOrderPayload): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${orderId}`, data);
    return response.data;
  },
};
