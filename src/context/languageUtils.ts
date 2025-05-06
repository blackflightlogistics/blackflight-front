// src/context/languageUtils.ts
import { translations } from "../translations";

// Definição dos idiomas disponíveis
export type Language = "EN" | "FR" | "ES" | "PT";

// Tipagem das traduções
export type TranslationsType = typeof translations.EN;

// Função para carregar o idioma do localStorage
export const getSavedLanguage = (): Language => {
  const savedLanguage = localStorage.getItem("selectedLanguage") as Language | null;
  return savedLanguage && ["EN", "FR", "ES", "PT"].includes(savedLanguage) ? savedLanguage : "EN";
};

// Função para salvar o idioma no localStorage
export const saveLanguage = (lang: Language) => {
  localStorage.setItem("selectedLanguage", lang);
};
