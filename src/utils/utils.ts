// src/utils/validadorStatus.ts

import { EncomendaStatus, PacoteStatus } from "../services/encomendaService";
import { TranslationsType } from "../context/languageUtils";

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

export function pacoteStatusToString(status: string, t: TranslationsType): string {
  switch (status) {
    case "em_preparacao":
      return t.status_em_preparacao;
    case "em_transito":
      return t.status_em_transito;
    case "aguardando_retirada":
      return t.status_aguardando_retirada;
    case "entregue":
      return t.status_entregue;
    case "cancelada":
      return t.status_cancelada;
    default:
      return "Status desconhecido";
  }
}


export function paymentTypeToString(paymentType: string, t: TranslationsType): string {
  switch (paymentType) {
    case "a_vista":
      return t.forma_pagamento_a_vista;
    case "parcelado":
      return t.forma_pagamento_parcelado;
    case "na_retirada":
      return t.forma_pagamento_na_retirada;
    default:
      return "Tipo de pagamento desconhecido";
  }
}

export function paymentStringToEnum(paymentType: string): string {
  switch (paymentType) {
    case "À Vista":
      return "a_vista";
    case "Parcelado":
      return "parcelado";
    case "Na Retirada":
      return "na_retirada";
    default:
      return "Tipo de pagamento desconhecido";
  }
}

