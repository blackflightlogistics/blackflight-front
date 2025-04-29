import api from "../api/api";


export type Address = {
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
  address: Address;
};
type RawAccount = {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  street?: string;
  number?: string;
  neighborhood?: string;
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
      address: {
        street: item.street || "",
        number: item.number || "",
        neighborhood: item.neighborhood || "",
        city: item.city || "",
        state: item.state || "",
        zipCode: item.cep || "",
        country: item.country || "",
      },
    }));
  },
  adicionar: async (cliente: Omit<Cliente, "id" | "address"> & { address: Address }): Promise<Cliente> => {
    const payload = {
      name: cliente.name,
      email: cliente.email,
      phone_number: cliente.phoneNumber,
      number: cliente.address.number,
      city: cliente.address.city,
      state: cliente.address.state,
      country: cliente.address.country,
      cep: cliente.address.zipCode,
    };

    const response = await api.post("/accounts", payload);

    const saved = response.data;

    return {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      phoneNumber: saved.phone_number,
      address: {
        street: "", // Por enquanto sem campo vindo
        number: saved.number,
        neighborhood: "",
        city: saved.city,
        state: saved.state,
        zipCode: saved.cep,
        country: saved.country,
      },
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
      address: {
        street: item.street || "",
        number: item.number || "",
        neighborhood: item.neighborhood || "",
        city: item.city || "",
        state: item.state || "",
        zipCode: item.cep || "",
        country: item.country || "",
      },
    };
  },

  atualizar: async (id: string, dados: Partial<Cliente>): Promise<Cliente> => {
    const payload = {
      name: dados.name,
      email: dados.email,
      phone_number: dados.phoneNumber,
      street: dados.address?.street,
      number: dados.address?.number,
      neighborhood: dados.address?.neighborhood,
      city: dados.address?.city,
      state: dados.address?.state,
      cep: dados.address?.zipCode,
      country: dados.address?.country,
    };

    const response = await api.put(`/accounts/${id}`, payload);
    const item = response.data;

    return {
      id: item.id,
      name: item.name,
      phoneNumber: item.phone_number,
      email: item.email,
      address: {
        street: item.street || "",
        number: item.number || "",
        neighborhood: item.neighborhood || "",
        city: item.city || "",
        state: item.state || "",
        zipCode: item.cep || "",
        country: item.country || "",
      },
    };
  },

  remover: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  },
};
