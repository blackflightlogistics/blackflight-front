// src/utils/validadorStatus.ts

import { EncomendaStatus, PacoteStatus } from "../services/encomendaService";

export function isEncomendaStatus(status: string): status is EncomendaStatus {
  return [
    "em preparação",
    "em transito",
    "aguardando retirada",
    "entregue",
    "cancelada",
  ].includes(status);
}

export function isPacoteStatus(status: string): status is PacoteStatus {
  return [
    "em preparação",
    "em transito",
    "aguardando retirada",
    "entregue",
    "cancelada",
  ].includes(status);

  
}
export function statusToString(status: EncomendaStatus): string {
  switch (status) {
    case "em preparação":
      return "Em Preparação";
    case "em transito":
      return "Em Transito";
    case "aguardando retirada":
      return "Aguardando Retirada";
    case "entregue":
      return "Entregue";
    case "cancelada":
      return "Cancelada";
    default:
      return status;
  }
}

// src/utils/statusValidators.ts


export const isValidEncomendaStatus = (status: string): status is EncomendaStatus => {
  return ["em preparação", "em transito", "aguardando retirada", "entregue", "cancelada"].includes(status);
};

export const isValidPacoteStatus = (status: string): status is PacoteStatus => {
  return ["em preparação", "em transito", "aguardando retirada", "entregue", "cancelada"].includes(status);
};
