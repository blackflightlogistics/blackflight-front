// src/services/configService.ts
import api from "../api/api";

export type Settings = {
  id: string;
  name: string;
  amountPerKg: string;      // Ex: "10,0"
  expressAmount: string;    // Ex: "14,0"
  insurancePerc: string;    // Ex: "0,03"
  insertedAt: string;
  updatedAt: string;
};

export type SettingsPayload = {
  amount_per_kg: string;
  express_amount: string;
  insurance_perc: string;
};

export const configService = {
  buscar: async (): Promise<Settings> => {
    const response = await api.get("/settings");
    const data = response.data;

    return {
      id: data.id,
      name: data.name,
      amountPerKg: data.amount_per_kg,
      expressAmount: data.express_amount,
      insurancePerc: data.insurance_perc,
      insertedAt: data.inserted_at,
      updatedAt: data.updated_at,
    };
  },

  atualizar: async (payload: SettingsPayload): Promise<void> => {
    await api.put("/settings", payload);
  },
};
