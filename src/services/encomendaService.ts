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

export interface OrderFilters {
  status?: EncomendaStatus;
  payment_type?: FormaPagamento;
  payment_status?: EncomendaPagamentoStatus;
  tracking_code?: string;
  initial_date?: string;
  final_date?: string;
}

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
  total_weight: string | null;
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
  listar: async (forShipment?: boolean, filters?: OrderFilters): Promise<Order[]> => {
    const filterObj: Record<string, string> = {};
    
    if (forShipment) {
      filterObj.for_shipment = "true";
    }
    
    if (filters) {
      if (filters.status) filterObj.status = filters.status;
      if (filters.payment_type) filterObj.payment_type = filters.payment_type;
      if (filters.payment_status) filterObj.payment_status = filters.payment_status;
      if (filters.tracking_code) filterObj.tracking_code = filters.tracking_code;
      if (filters.initial_date) filterObj.initial_date = filters.initial_date;
      if (filters.final_date) filterObj.final_date = filters.final_date;
    }

    const params = Object.keys(filterObj).length > 0 
      ? { filter: JSON.stringify(filterObj) } 
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
