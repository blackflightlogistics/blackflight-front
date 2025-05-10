import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useLanguage } from "../context/useLanguage";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [isOpen, setIsOpen] = useState(false);
  const { translations: t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      className={`pt-4  pb-4  left-0 w-full transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } bg-white border-b border-gray-200 z-50`}
    >
      <div className="flex  justify-between items-center max-w-7xl mx-auto px-4 md:px-8">
        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-black">
          <img
            src="/minimal_logo_black.svg"
            alt="logo"
            className="w-[2rem] h-[3rem]"
          />
        </Link>

        {/* LINKS - DESKTOP */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <p className="font-secondary text-sm font-medium text-orange">
            {t.inicio}
          </p>
          <p className="font-secondary text-sm font-medium">{t.rastreio}</p>
          <p className="font-secondary text-sm font-medium">{t.quem_somos}</p>
          <p className="font-secondary text-sm font-medium">
            {t.nossos_servicos}
          </p>
        </div>
        <Link
          to="/admin/login"
          className="px-4 py-2 bg-black text-white text-sm font-normal font-secondary rounded-md hover:opacity-80 "
        >
          {t.area_administrativa}
        </Link>
        {/* MENU MOBILE */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? (
            <FiX size={28} className="text-black" />
          ) : (
            <img
              src="/hamburguer-black-button.svg"
              alt="Abrir menu"
              className="w-7 h-7"
            />
          )}
        </button>
      </div>

      {/* MENU MOBILE */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-white border-t border-gray-200 p-4 space-y-4">
          <Link
            to="/rastreamento"
            onClick={() => setIsOpen(false)}
            className="text-sm text-black font-semibold"
          >
            {t.onde_esta_meu_pacote}
          </Link>
          <Link
            to="/admin/login"
            onClick={() => setIsOpen(false)}
            className="text-sm text-black font-semibold"
          >
            {t.area_administrativa}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
