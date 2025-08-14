// src/services/clienteService.ts
import api from "../api/api";

export type Address = {
  id?: string;
  street: string | null;
  number: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  cep: string | null;
  country: string;
};

export type Cliente = {
  id: string;
  name: string;
  last_name: string;
  phone_number: string;
  email: string;
  document?: string;
  removed_adresses: string[];
  adresses: Address[];
};

type RawAccount = {
  id: string;
  name: string;
  last_name: string;
  email: string;
  document?: string;
  phone_number: string;
  adresses?: RawAdress[]; // <- campo correto da API
};

type RawAdress = {
  id?: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  country: string;
};

export const clienteService = {
  listar: async (): Promise<Cliente[]> => {
    const response = await api.get<{ data: RawAccount[] }>("/accounts");
    const data = response.data.data;

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      last_name: item.last_name,
      phone_number: item.phone_number,
      email: item.email,
      document: item.document,
      removed_adresses: [],       
      adresses: item.adresses?.map((addr) => ({
        id: addr.id || "",
        street: addr.street || "",
        number: addr.number || "",
        neighborhood: addr.neighborhood || "",
        city: addr.city || "",
        state: addr.state || "",
        cep: addr.cep || "",
        country: addr.country || "",
      })) || [],
    }));
  },

  adicionar: async (
    cliente: Omit<Cliente, "id">
  ): Promise<Cliente> => {
    const payload = {
      last_name: cliente.last_name,
      name: cliente.name,
      email: cliente.email,
      document: cliente.document,
      phone_number: cliente.phone_number,
      adresses: cliente.adresses.map((addr) => ({
        adress_id: (  addr.id == "" ? null : addr.id),
        street: addr.street,
        number: addr.number,
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        cep: addr.cep,
        country: addr.country,
      })),
    };
console.log("payload", payload);
    const response = await api.post("/accounts", payload);
    const saved = response.data;

    return {
      id: saved.id,
      name: saved.name,
      last_name: saved.last_name,
      phone_number: saved.phone_number,
      email: saved.email,
      document: saved.document,
      removed_adresses: [],
      adresses: saved.adresses?.map((addr: RawAdress) => ({
        id: addr.id,
        street: addr.street,
        number: addr.number,
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        cep: addr.cep,
        country: addr.country,
      })) || [],
    };
  },

  buscarPorId: async (id: string): Promise<Cliente> => {
    const response = await api.get(`/accounts/${id}`);
    const item = response.data;

    return {
      id: item.id,
      name: item.name,
      last_name: item.last_name,
      document: item.document,
      phone_number: item.phone_number,
      email: item.email,
      removed_adresses: [],
      adresses: item.adresses?.map((addr: RawAdress) => ({
        street: addr.street,
        id: addr.id,
        number: addr.number,
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        cep: addr.cep,
        country: addr.country,
      })) || [],
    };
  },

  atualizar: async (
    id: string,
    dados: Partial<Cliente>
  ): Promise<Cliente> => {
    const payload = {
      last_name: dados.last_name,
      name: dados.name,
      email: dados.email,
      document: dados.document,
      phone_number: dados.phone_number,
      removed_adresses: dados.removed_adresses,
      adresses: dados.adresses?.map((addr) => ({
        adress_id:(  addr.id == "" ? null : addr.id),
        street: addr.street,
        number: addr.number,
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        cep: addr.cep,
        country: addr.country,
      })),
    };

    const response = await api.put(`/accounts/${id}`, payload);
    const item = response.data;

    return {
      id: item.id,
      name: item.name,
      last_name: item.last_name,
      phone_number: item.phone_number,
      email: item.email,
      document: item.document,
      removed_adresses: item.removed_adresses || [],
      adresses: item.adresses?.map((addr: RawAdress) => ({
        id: addr.id,
        street: addr.street,
        number: addr.number,
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        cep: addr.cep,
        country: addr.country,
      })) || [],
    };
  },

  remover: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  },
};
