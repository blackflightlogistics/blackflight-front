import { useRef, useState, useEffect } from "react";
import { useLanguage } from "../context/useLanguage";

const LanguageSwitcher = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const { changeLanguage } = useLanguage();

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={languageMenuRef}>
      <button
        onClick={() => setIsLanguageOpen(!isLanguageOpen)}
        className="inline-block"
      >
        <img
          src="/language-icon.svg"
          alt="Language"
          className="w-6 h-6"
        />
      </button>

      {isLanguageOpen && (
        <div className="absolute right-0 mt-2 bg-white text-gold shadow-lg rounded-md z-50 w-40">
          <ul className="flex flex-col divide-y divide-orange">
            <li
              className="px-4 py-2 hover:bg-softWhite flex items-center gap-2 cursor-pointer"
              onClick={() => {
                changeLanguage("FR");
                setIsLanguageOpen(false);
              }}
            >
              🇫🇷 Français
            </li>
            <li
              className="px-4 py-2 hover:bg-softWhite flex items-center gap-2 cursor-pointer"
              onClick={() => {
                changeLanguage("EN");
                setIsLanguageOpen(false);
              }}
            >
              🇬🇧 English
            </li>
            <li
              className="px-4 py-2 hover:bg-softWhite flex items-center gap-2 cursor-pointer"
              onClick={() => {
                changeLanguage("ES");
                setIsLanguageOpen(false);
              }}
            >
              🇪🇸 Español
            </li>
            <li
              className="px-4 py-2 hover:bg-softWhite flex items-center gap-2 cursor-pointer"
              onClick={() => {
                changeLanguage("PT");
                setIsLanguageOpen(false);
              }}
            >
                🇧🇷 Português
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
