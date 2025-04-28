import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";

interface HomeFooterProps {
  codigoDigitado: string;
  setCodigoDigitado: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const HomeFooter = ({ codigoDigitado, setCodigoDigitado, handleSubmit }: HomeFooterProps) => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        
        {/* Logo e redes sociais */}
        <div>
          <div className="mb-4">
            <Link to="/" className="text-xl font-bold text-black">
              <img src="image.png" alt="logo" className="w-[3rem] h-[2rem]" />
            </Link>
          </div>
          <div className="flex gap-4">
            <a href="#" className="bg-black border border-orange p-2 rounded-full hover:bg-orange transition">
              <FaFacebookF className="text-orange hover:text-black text-sm" />
            </a>
            <a href="#" className="bg-black border border-orange p-2 rounded-full hover:bg-orange transition">
              <FaInstagram className="text-orange hover:text-black text-sm" />
            </a>
            <a href="#" className="bg-black border border-orange p-2 rounded-full hover:bg-orange transition">
              <FaLinkedinIn className="text-orange hover:text-black text-sm" />
            </a>
            <a href="#" className="bg-black border border-orange p-2 rounded-full hover:bg-orange transition">
              <FaYoutube className="text-orange hover:text-black text-sm" />
            </a>
          </div>
        </div>

        {/* Serviços */}
        <div>
          <h3 className="font-semibold font-primary text-white mb-4">
            <span className="border-b-2 border-orange pb-1">Serviços</span>
          </h3>
          <ul className="space-y-2 text-sm font-normal font-secondary text-lightGrey">
            <li>Envio de pacotes</li>
            <li>Rastreamento online</li>
            <li>Atendimento personalizado</li>
          </ul>
        </div>

        {/* Links úteis */}
        <div>
          <h3 className="font-semibold font-primary text-white mb-4">
            <span className="border-b-2 border-orange pb-1">Links Úteis</span>
          </h3>
          <ul className="space-y-2 text-sm font-normal font-secondary text-lightGrey">
            <li>Rastreie sua encomenda</li>
            <li>Quem somos</li>
            <li>Nossos serviços</li>
          </ul>
        </div>

        {/* Rastreio rápido */}
        <div>
          <h3 className="font-semibold font-primary text-white mb-4">
            <span className="border-b-2 border-orange pb-1">Rastreie sua encomenda</span>
          </h3>
          <p className="text-sm font-normal font-secondary text-lightGrey mb-2">
            Insira o código de rastreio
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex overflow-hidden rounded-md"
          >
            <input
              name="codigo"
              value={codigoDigitado}
              onChange={(e) => setCodigoDigitado(e.target.value)}
              placeholder="Código de rastreio"
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
      <p className="text-xs text-center text-white/70">
        © 2025 Sistema de envio de pacotes. Todos os direitos reservados.
      </p>
    </footer>
  );
};

export default HomeFooter;
