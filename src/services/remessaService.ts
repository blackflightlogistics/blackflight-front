// src/services/remessaService.ts

import api from "../api/api";
export type RemessaStatus =
  | "em_preparacao"
  | "em_transito"
  | "aguardando_retirada"
  | "entregue"
  | "cancelada";

export interface Shipment {
  id: string;
  country: string;
  inserted_at: string;
  updated_at: string;
  status: string | null;
  total_weight: string;
  orders: ShipmentOrder[];
}
export interface AtualizarRemessaPayload {
  status: RemessaStatus;
  added_orders: string[];
  removed_orders: string[];
}

export interface ShipmentOrder {
  id: string;
  from_account_id: string;
  tracking_code: string | null;
  to_account_id: string;
  inserted_at: string;
  updated_at: string;
  shipment_id: string;
  is_express: boolean;
  status: string;
  scheduled_date: string | null;
  packages: Package[];
  from_account: Partial<Account>;
  to_account: Partial<Account>;
}

export interface Package {
  id?: string;
  description?: string;
  declared_value?: string;
  weight?: string;
  status?: string;
  inserted_at?: string;
  updated_at?: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  country: string;
  inserted_at: string;
}

export interface NovaRemessaPayload {
  status: string;
  country: string;
  orders: string[]; // IDs das encomendas
}

export const remessaService = {
  listar: async (): Promise<Shipment[]> => {
    const response = await api.get<{ data: Shipment[] }>("/shipments");
    return response.data.data;
  },

  adicionar: async (dados: NovaRemessaPayload): Promise<Shipment> => {
    const response = await api.post<Shipment>("/shipments", dados);
    return response.data;
  },
  buscarPorId: async (id: string): Promise<Shipment> => {
    const response = await api.get<Shipment>(`/shipments/${id}`);
    return response.data;
  },
  atualizar: async (id: string, dados: AtualizarRemessaPayload): Promise<Shipment> => {
    const response = await api.put<Shipment>(`/shipments/${id}`, dados);
    return response.data;
  },
  atualizarStatus: async (
    id: string,
    status: string,
    added_orders: string[] = [],
    removed_orders: string[] = []
  ): Promise<void> => {
    await api.put(`/shipments/${id}`, {
      status,
      added_orders,
      removed_orders,
    });
  },
};
