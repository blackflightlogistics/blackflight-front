
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
const encomendas: Encomenda[] = [
    {
      id: 1001,
      remetenteId: 1,
      destinatarioId: 2,
      enderecoEntrega: {
        rua: "Avenida Brasil",
        numero: "789",
        bairro: "Botafogo",
        cidade: "Rio de Janeiro",
        estado: "RJ",
        cep: "22250-040"
      },
      status: "em transito",
      pacotes: [
        {
          id: 1,
          descricao: "Caixa de livros",
          peso: 3.5,
          status: "em transito"
        },
        {
          id: 2,
          descricao: "Notebook",
          peso: 2.0,
          status: "em transito"
        }
      ]
    }
  ];

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
