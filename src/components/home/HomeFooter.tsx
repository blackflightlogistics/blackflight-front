import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPaperPlane,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/useLanguage";

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
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        {/* Logo e redes sociais */}
        <div>
          <div className="mb-4">
            <Link to="/" className="text-xl font-bold text-black">
              <img src="logo2.png" alt="logo" />
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
            <li>{t.footer_services_1}</li>
            <li>{t.footer_services_2}</li>
            <li>{t.footer_services_3}</li>
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
            <li>{t.footer_links_1}</li>
            <li>{t.footer_links_2}</li>
            <li>{t.footer_links_3}</li>
          </ul>
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
