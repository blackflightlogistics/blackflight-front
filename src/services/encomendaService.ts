
export type PacoteStatus = "em preparação" | "em transito" | "aguardando retirada" | "entregue" | "cancelada";
export type EncomendaStatus = "em preparação" | "em transito" | "aguardando retirada" | "entregue" | "cancelada";

export type Pacote = {
  id: number;
  descricao: string;
  peso: number;
  status: PacoteStatus;
  valorCalculado: number;
  valorDeclarado?: number;
};

export type Encomenda = {
  id: number;
  remetenteId: number;
  destinatarioId: number;
  enderecoEntrega: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  status: EncomendaStatus;
  pacotes: Pacote[];
  valorTotal?: number; // NOVO
};
let encomendas: Encomenda[] = [];

export const encomendaService = {
    listar: async (): Promise<Encomenda[]> => {
        if (encomendas.length === 0) {
          const response = await fetch("/mocks/encomendas.json");
          encomendas = await response.json();
        }
        return encomendas;
      },

  adicionar: async (encomenda: Omit<Encomenda, "id">): Promise<Encomenda> => {
    const nova: Encomenda = { ...encomenda, id: Date.now() };
    encomendas.push(nova);
    return Promise.resolve(nova);
  },
  buscarPorId: async (id: number): Promise<Encomenda> => {
    const encomendas = await encomendaService.listar();
    const encontrada = encomendas.find((e) => e.id === id);
    if (!encontrada) throw new Error("Encomenda não encontrada");
    return encontrada;
  }
};
