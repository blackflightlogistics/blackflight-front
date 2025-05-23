// src/utils/validadorStatus.ts

import { EncomendaStatus, PacoteStatus } from "../services/encomendaService";
import { getSavedLanguage, TranslationsType } from "../context/languageUtils";

export function isEncomendaStatus(status: string): status is EncomendaStatus {
  return [
    "em_preparacao",
    "em_transito",
    "aguardando_retirada",
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


export function adicionarDiasEntrega(dataOriginalStr: string, expressa: boolean): string {
  const dataOriginal = new Date(dataOriginalStr);
  const diasParaAdicionar = expressa ? 3 : 10;

  const dataFinal = new Date(dataOriginal);
  dataFinal.setDate(dataFinal.getDate() + diasParaAdicionar);
if(getSavedLanguage() === "PT"){ 
  return dataFinal.toLocaleDateString("pt-BR"); // você pode ajustar o locale se quiser
}else if(getSavedLanguage() === "FR"){
  return dataFinal.toLocaleDateString("fr-FR"); // você pode ajustar o locale se quiser
}else if(getSavedLanguage() === "ES"){
  return dataFinal.toLocaleDateString("es-ES"); // você pode ajustar o locale se quiser
}else if(getSavedLanguage() === "EN"){
  return dataFinal.toLocaleDateString("en-US");
 } // você pode ajustar o locale se quiser
else {
  return dataFinal.toLocaleDateString("en-US"); // você pode ajustar o locale se quiser 
}
}

export function apresentaDataFormatada(dataOriginalStr: string, ): string {
  const dataOriginal = new Date(dataOriginalStr);
  

  const dataFinal = new Date(dataOriginal);
  dataFinal.setDate(dataFinal.getDate());
if(getSavedLanguage() === "PT"){ 
  return dataFinal.toLocaleDateString("pt-BR"); // você pode ajustar o locale se quiser
}else if(getSavedLanguage() === "FR"){
  return dataFinal.toLocaleDateString("fr-FR"); // você pode ajustar o locale se quiser
}else if(getSavedLanguage() === "ES"){
  return dataFinal.toLocaleDateString("es-ES"); // você pode ajustar o locale se quiser
}else if(getSavedLanguage() === "EN"){
  return dataFinal.toLocaleDateString("en-US");
 } // você pode ajustar o locale se quiser
else {
  return dataFinal.toLocaleDateString("en-US"); // você pode ajustar o locale se quiser 
}
}

