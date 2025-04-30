// src/services/encomendaService.ts

import api from "../api/api";

export type FormaPagamento = "à vista" | "parcelado" | "na retirada";


/** Interfaces refletindo o que o backend retorna */
export interface Account {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  country: string;
  inserted_at: string;
}

export interface Package {
  id: string;
  description: string;
  weight: string; // conforme vem do back
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
  status: string;
  is_express: boolean;
  scheduled_date: string | null;
  shipment_id: string | null;
  inserted_at: string;
  updated_at: string;
  packages: Package[];
}

/** Interface para criação de uma nova encomenda */
export interface CreateOrderPayload {
  from_account_id: string;
  to_account_id: string;
  status?: string;
  is_express: boolean;
  scheduled_date?: string;
  packages: {
    description: string;
    weight: string; // ou number (vamos enviar como string para compatibilidade)
    status: string;
    declared_value: string; // ou number (vamos enviar como string)
  }[];
}

/** Service */
export const orderService = {
  /** Listar todas as encomendas */
  listar: async (): Promise<Order[]> => {
    const response = await api.get<{ data: Order[] }>("/orders");
    return response.data.data;
  },

  /** Buscar uma encomenda pelo ID */
  buscarPorId: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  /** Adicionar (criar) uma nova encomenda */
  adicionar: async (orderData: CreateOrderPayload): Promise<Order> => {
    const response = await api.post<Order>("/orders", orderData);
    return response.data;
  },
};
