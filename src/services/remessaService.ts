
import { Encomenda, encomendaService } from "./encomendaService";

export type RemessaStatus = "aberta" | "fechada" | "enviada";

export type Remessa = {
  id: number;
  pais: string;
  status: RemessaStatus;
  encomendaIds: number[];
  pesoTotal: number;
  dataCriacao: Date;
  dataEnvio?: Date;
};

let remessas: Remessa[] = [

];

const calcularPesoTotal = async (remessa: Remessa): Promise<number> => {
  const todasEncomendas = await encomendaService.listar();
  const encomendasDaRemessa = todasEncomendas.filter(e =>
    remessa.encomendaIds.includes(e.id)
  );
  return encomendasDaRemessa.reduce((total, encomenda) => {
    const peso = encomenda.pacotes.reduce((soma, pacote) => soma + pacote.peso, 0);
    return total + peso;
  }, 0);
};

export const remessaService = {
  listar: async (): Promise<Remessa[]> => {
    if (remessas.length === 0) {
      const response = await fetch("/mocks/remessas.json");
      remessas = await response.json();
    }
    return remessas;
  },
  adicionar: async (pais: string): Promise<Remessa> => {
    const nova: Remessa = {
      id: Date.now(),
      pais,
      status: "aberta",
      encomendaIds: [],
      pesoTotal: 0,
      dataCriacao: new Date(),
    };
    remessas.push(nova);
    return Promise.resolve(nova);
  },
  adicionarComEncomendas: async (remessa: Remessa): Promise<Remessa> => {
    remessa.id = Date.now();
    remessas.push(remessa);
    return Promise.resolve(remessa);
  },
  adicionarEncomenda: async (idRemessa: number, idEncomenda: number): Promise<void> => {
    const remessa = remessas.find(r => r.id === idRemessa);
    if (!remessa) return;

    if (!remessa.encomendaIds.includes(idEncomenda)) {
      remessa.encomendaIds.push(idEncomenda);
      remessa.pesoTotal = await calcularPesoTotal(remessa);
    }
  },

  atualizarStatus: async (idRemessa: number, status: RemessaStatus): Promise<void> => {
    const remessa = remessas.find(r => r.id === idRemessa);
    if (!remessa) return;

    remessa.status = status;
    if (status === "enviada") {
      remessa.dataEnvio = new Date();
    }
  },

  buscarPorId: async (id: number): Promise<Remessa | undefined> => {
    return Promise.resolve(remessas.find(r => r.id === id));
  },

  adicionarEncomendaOuCriar: async (encomenda: Encomenda, pais: string): Promise<void> => {
    let remessa = remessas.find(r => r.status === "aberta" && r.pais.toLowerCase() === pais.toLowerCase());

    if (!remessa) {
      remessa = {
        id: Date.now(),
        pais,
        status: "aberta",
        encomendaIds: [],
        pesoTotal: 0,
        dataCriacao: new Date(),
      };
      remessas.push(remessa);
    }

    if (!remessa.encomendaIds.includes(encomenda.id)) {
      remessa.encomendaIds.push(encomenda.id);
      remessa.pesoTotal = await calcularPesoTotal(remessa);
    }
  }
};
