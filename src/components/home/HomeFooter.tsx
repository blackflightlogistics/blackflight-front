import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPaperPlane,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/useLanguage";
import { scrollToSection } from "../../utils/scrollToSection";

interface HomeFooterProps {
  codigoDigitado: string;
  setCodigoDigitado: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const HomeFooter = ({
  codigoDigitado,
  setCodigoDigitado,
  handleSubmit,
}: HomeFooterProps) => {
  const { translations: t } = useLanguage();

  return (
    <footer className="bg-black text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-8 lg:gap-12">
        {/* Logo e redes sociais */}
        <div>
          <div className="mb-4">
            <Link to="/" className="text-xl font-bold text-black">
              <img src="logo3.png" alt="logo" />
            </Link>
          </div>
          <div className="flex gap-4">
            <a
              href="#"
              className="bg-black border border-orange p-2 rounded-full hover:bg-orange transition"
            >
              <FaFacebookF className="text-orange hover:text-black text-sm" />
            </a>
            <a
              href="#"
              className="bg-black border border-orange p-2 rounded-full hover:bg-orange transition"
            >
              <FaInstagram className="text-orange hover:text-black text-sm" />
            </a>
            <a
              href="#"
              className="bg-black border border-orange p-2 rounded-full hover:bg-orange transition"
            >
              <FaLinkedinIn className="text-orange hover:text-black text-sm" />
            </a>
            <a
              href="#"
              className="bg-black border border-orange p-2 rounded-full hover:bg-orange transition"
            >
              <FaYoutube className="text-orange hover:text-black text-sm" />
            </a>
          </div>
        </div>

        {/* Serviços */}
        <div>
          <h3 className="font-semibold font-primary text-white mb-4">
            <span className="border-b-2 border-orange pb-1">
              {t.footer_services_title}
            </span>
          </h3>
          <ul className="space-y-2 text-sm font-normal font-secondary text-lightGrey">
            <li
              onClick={() => scrollToSection("servicos")}
              className="cursor-pointer hover:underline"
            >
              {t.footer_services_1}
            </li>
            <li
              onClick={() => scrollToSection("servicos")}
              className="cursor-pointer hover:underline"
            >
              {t.footer_services_2}
            </li>
            <li
              onClick={() => scrollToSection("servicos")}
              className="cursor-pointer hover:underline"
            >
              {t.footer_services_3}
            </li>
          </ul>
        </div>

        {/* Links úteis */}
        <div>
          <h3 className="font-semibold font-primary text-white mb-4">
            <span className="border-b-2 border-orange pb-1">
              {t.footer_links_title}
            </span>
          </h3>
          <ul className="space-y-2 text-sm font-normal font-secondary text-lightGrey">
            <li
              onClick={() => scrollToSection("rastreamento")}
              className="cursor-pointer hover:underline"
            >
              {t.footer_links_1}
            </li>
            <li
              onClick={() => scrollToSection("quem-somos")}
              className="cursor-pointer hover:underline"
            >
              {t.footer_links_2}
            </li>
            <li
              onClick={() => scrollToSection("servicos")}
              className="cursor-pointer hover:underline"
            >
              {t.footer_links_3}
            </li>
          </ul>
        </div>

        {/* Nossos Escritórios */}
        <div>
          <h3 className="font-semibold font-primary text-white mb-4">
            <span className="border-b-2 border-orange pb-1">
              <FaMapMarkerAlt className="inline mr-2" />
              Nos Bureaux
            </span>
          </h3>
          <div className="space-y-4 text-xs font-normal font-secondary text-lightGrey">
            {/* França */}
            <div>
              <p className="text-orange font-medium mb-1">🇫🇷 FRANCE</p>
              <p className="mb-1">11 Cité Riverin, 75010 Paris</p>
              <p className="text-xs opacity-80">(Lundi au Samedi 9:30 - 19:30)</p>
            </div>
            
            {/* Camarões - Douala */}
            <div>
              <p className="text-orange font-medium mb-1">🇨🇲 CAMEROUN (Douala)</p>
              <p className="mb-1">{t.endereco_duala}</p>
              <p className="text-xs opacity-80">(Lundi au Samedi 10:00 - 16:30)</p>
            </div>
            
            {/* Camarões - Yaoundé */}
            <div>
              <p className="text-orange font-medium mb-1">🇨🇲 CAMEROUN (Yaoundé)</p>
              <p className="mb-1">{t.endereco_younde}</p>
              <p className="text-xs opacity-80 mb-1">Tel: +237 69 12 04 393 (Christine)</p>
              <p className="text-xs opacity-80">(Lundi au Samedi 10:00 - 16:30)</p>
            </div>
          </div>
        </div>

        {/* Rastreio rápido */}
        <div>
          <h3 className="font-semibold font-primary text-white mb-4">
            <span className="border-b-2 border-orange pb-1">
              {t.footer_track_title}
            </span>
          </h3>
          <p className="text-sm font-normal font-secondary text-lightGrey mb-2">
            {t.footer_track_subtext}
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex overflow-hidden rounded-md"
          >
            <input
              name="codigo"
              value={codigoDigitado}
              onChange={(e) => setCodigoDigitado(e.target.value)}
              placeholder={t.footer_track_subtext}
              className="flex-1 px-3 py-2 text-sm text-black outline-none"
            />
            <button
              type="submit"
              className="bg-orange text-white px-4 flex items-center justify-center"
            >
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Linha separadora */}
      <hr className="my-8 border-white/10" />

      {/* Direitos reservados */}
      <p className="text-xs text-center text-white/70">{t.footer_copyright}</p>
    </footer>
  );
};

export default HomeFooter;