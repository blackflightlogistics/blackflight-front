export type Cliente = {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
};

// Dados mockados em memória
let clientes: Cliente[] = [];

export const clienteService = {
  listar: async (): Promise<Cliente[]> => {
    if (clientes.length === 0) {
      const response = await fetch("/mocks/clientes.json");
      clientes = await response.json();
    }
    return clientes;
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
  buscarPorId: async (id: number): Promise<Cliente> => {
    const clientes = await clienteService.listar();
    const encontrado = clientes.find((c) => c.id === id);
    if (!encontrado) throw new Error("Cliente não encontrado");
    return encontrado;
  }
  
};
