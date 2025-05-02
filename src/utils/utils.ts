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
export function statusToString(status: string): string {
  switch (status) {
    case "em_preparacao":
      return "Em Preparação";
    case "em_transito":
      return "Em Transito";
    case "aguardando_retirada":
      return "Aguardando Retirada";
    case "entregue":
      return "Entregue";
    case "cancelada":
      return "Cancelada";
    default:
      return "Status desconhecido";
  }
}

export function paymentTypeToString(paymentType: string): string {
  switch (paymentType) {
    case "a_vista":
      return "À Vista";
    case "parcelado":
      return "Parcelado";
    case "na_retirada":
      return "Na Retirada";
    default:
      return "Tipo de pagamento desconhecido";
  }
}