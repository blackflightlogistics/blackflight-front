export type Cliente = {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
};

// Dados mockados em memória
let clientes: Cliente[] = [
  {
    id: 1,
    nome: "Lucas Silva",
    telefone: "11999999999",
    email: "lucas@email.com",
    endereco: "Rua das Flores, 123 - Centro, São Paulo - SP, 01000-000"
  },
  {
    id: 2,
    nome: "Mariana Souza",
    telefone: "21988888888",
    email: "mariana@email.com",
    endereco: "Avenida Brasil, 456 - Copacabana, Rio de Janeiro - RJ, 22000-000"
  }
];

export const clienteService = {
  listar: async (): Promise<Cliente[]> => {
    return Promise.resolve(clientes);
  },

  adicionar: async (cliente: Omit<Cliente, "id">): Promise<Cliente> => {
    const novoCliente = { ...cliente, id: Date.now() };
    clientes.push(novoCliente);
    return Promise.resolve(novoCliente);
  },

  remover: async (id: number): Promise<void> => {
    clientes = clientes.filter((c) => c.id !== id);
    return Promise.resolve();
  },
  atualizar: async (id: number, dados: Partial<Cliente>): Promise<Cliente | null> => {
    const index = clientes.findIndex((c) => c.id === id);
    if (index === -1) return null;
    clientes[index] = { ...clientes[index], ...dados };
    return Promise.resolve(clientes[index]);
  },
};
