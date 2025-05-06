import { createContext } from "react";
import { Language, TranslationsType } from "./languageUtils";


export interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  translations: TranslationsType;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
