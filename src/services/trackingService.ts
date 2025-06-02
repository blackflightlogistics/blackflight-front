import api from "../api/api";
import { Address } from "./clienteService";

export type TrackingPackage = {
    id: string;
    description: string;
    weight: string;
    status: string;
    declared_value: string;
    computed_value: string;
};
export type TrackingRemessaResponse = {
  id: string;
  tracking_code: string;
  total_weight: string;
  inserted_at: string;
  updated_at: string;
  status: string;
  scheduled_date: string | null;
  country: string;
  orders: TrackingResponse[];
};
export type TrackingStatus = {
    status: string;
    inserted_at: string;
    updated_at: string;
    id: string;
    order_id: string;
};

export type TrackingResponse = {
    tracking_code: string;
    id: string;
    inserted_at: string;
    status: string;
    total_weight: string;
    total_value: string;
    is_express: boolean;
    scheduled_date: string | null;
    from_account: {
        name: string;
        email: string;
        phone_number: string;
        adresses: Address[];

    };
    to_account: {
        name: string;
        email: string;
        phone_number: string;
        adresses: Address[];

    };
    packages: TrackingPackage[];
    history_status: TrackingStatus[];
};

export const trackingService = {
    buscarPorCodigo: async (codigo: string): Promise<TrackingResponse | null> => {
        try {
            const response = await api.get(`/orders/public/${codigo}`, {

            });

            const data = response.data?.data?.[0];
            return data || null;
        } catch (error) {
            console.error("Erro ao buscar rastreamento:", error);
            return null;
        }
    },
    buscarPorPedacoDeCodigoOrder: async (codigo: string): Promise<[TrackingResponse] | null> => {
        try {
            const response = await api.get(`/orders/public/order/${codigo}`, {

            });

            const data = response.data?.data;
            return data || null;
        } catch (error) {
            console.error("Erro ao buscar rastreamento:", error);
            return null;
        }
    },
     buscarRemessaPorCodigo: async (codigo: string): Promise<TrackingRemessaResponse[] | null> => {
    try {
      const response = await api.get(`/shipments/public/shipment/${codigo}`);
      const data = response.data?.data;
      return data || null;
    } catch (error) {
      console.error("Erro ao buscar remessa:", error);
      return null;
    }
  },
};
