import React, { useState, useEffect } from "react";

import { LanguageContext } from "./LanguageContext";
import { Language, getSavedLanguage, saveLanguage } from "./languageUtils";
import { translations } from "../translations";

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(getSavedLanguage());

  useEffect(() => {
    setLanguage(getSavedLanguage());
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    saveLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, translations: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};
