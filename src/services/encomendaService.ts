
export type PacoteStatus = "em preparação" | "em transito" | "aguardando retirada" | "entregue" | "cancelada";
export type EncomendaStatus = "em preparação" | "em transito" | "aguardando retirada" | "entregue" | "cancelada";

export type Pacote = {
  id: number;
  descricao: string;
  peso: number;
  status: PacoteStatus;
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
};

const encomendas: Encomenda[] = [];

export const encomendaService = {
  listar: async (): Promise<Encomenda[]> => {
    return Promise.resolve(encomendas);
  },

  adicionar: async (encomenda: Omit<Encomenda, "id">): Promise<Encomenda> => {
    const nova: Encomenda = { ...encomenda, id: Date.now() };
    encomendas.push(nova);
    return Promise.resolve(nova);
  },
};
