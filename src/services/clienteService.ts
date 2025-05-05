// src/services/clienteService.ts
import api from "../api/api";

export type Address = {
  id?: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type Cliente = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  addresses: Address[];
};

type RawAccount = {
  id: string;
  name: string;
  email: string;
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
      phoneNumber: item.phone_number,
      email: item.email,
      addresses: item.adresses?.map((addr) => ({
        street: addr.street || "",
        number: addr.number || "",
        neighborhood: addr.neighborhood || "",
        city: addr.city || "",
        state: addr.state || "",
        zipCode: addr.cep || "",
        country: addr.country || "",
      })) || [],
    }));
  },

  adicionar: async (
    cliente: Omit<Cliente, "id">
  ): Promise<Cliente> => {
    const payload = {
      name: cliente.name,
      email: cliente.email,
      phone_number: cliente.phoneNumber,
      adresses: cliente.addresses.map((addr) => ({
        id: addr.id ?? null,
        street: addr.street,
        number: addr.number,
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        cep: addr.zipCode,
        country: addr.country,
      })),
    };

    const response = await api.post("/accounts", payload);
    const saved = response.data;

    return {
      id: saved.id,
      name: saved.name,
      phoneNumber: saved.phone_number,
      email: saved.email,
      addresses: saved.adresses?.map((addr: RawAdress) => ({
        street: addr.street,
        number: addr.number,
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        zipCode: addr.cep,
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
      phoneNumber: item.phone_number,
      email: item.email,
      addresses: item.adresses?.map((addr: RawAdress) => ({
        street: addr.street,
        id: addr.id,
        number: addr.number,
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        zipCode: addr.cep,
        country: addr.country,
      })) || [],
    };
  },

  atualizar: async (
    id: string,
    dados: Partial<Cliente>
  ): Promise<Cliente> => {
    const payload = {
      name: dados.name,
      email: dados.email,
      phone_number: dados.phoneNumber,
      adresses: dados.addresses?.map((addr) => ({
        adress_id: addr.id ?? null,
        street: addr.street,
        number: addr.number,
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        cep: addr.zipCode,
        country: addr.country,
      })),
    };

    const response = await api.put(`/accounts/${id}`, payload);
    const item = response.data;

    return {
      id: item.id,
      name: item.name,
      phoneNumber: item.phone_number,
      email: item.email,
      addresses: item.adresses?.map((addr: RawAdress) => ({
        street: addr.street,
        number: addr.number,
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        zipCode: addr.cep,
        country: addr.country,
      })) || [],
    };
  },

  remover: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  },
};
