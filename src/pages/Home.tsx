import {   useRef, useState } from "react";
import Navbar from "../components/Navbar";
// import { Encomenda } from "../services/encomendaService";
import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
// import TrackingField from "../components/home/TrackingField";
import ServicesSection from "../components/home/ServicesSection";
// import WhoWeAre from "../components/home/WhoWeAre";
import FrequentlyQuestion from "../components/home/FrequentlyQuestion";
// import HomeFooter from "../components/home/HomeFooter";
import { FiSearch } from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPaperPlane,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Home() {
  // const resultadoRef = useRef<HTMLDivElement>(null);
  const [codigoDigitado, setCodigoDigitado] = useState("");
  const [resultado, setResultado] = useState(false);
  const resultadoRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigoDigitado.trim() !== "") {
      setResultado(true);
  
      setTimeout(() => {
        resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100); // pequeno delay para garantir que o DOM atualizou
    }
  };

  const limpar = () => {
    setCodigoDigitado("");
    setResultado(false);
  };

  // useEffect(() => {
  //   const handler = (e: CustomEvent<string>) => {
  //     const codigoBuscado = e.detail;
  //     setCodigo(codigoBuscado);

  //     fetch("/mocks/encomendas.json")
  //       .then((res) => res.json())
  //       .then((data: Encomenda[]) => {
  //         const encontrada = data.find((e) => `E-${e.id}` === codigoBuscado);
  //         setEncomenda(encontrada || null);

  //         setTimeout(() => {
  //           resultadoRef.current?.scrollIntoView({ behavior: "smooth" });
  //         }, 100);
  //       });
  //   };

  //   window.addEventListener("buscar-encomenda", handler as EventListener);

  //   return () => {
  //     window.removeEventListener("buscar-encomenda", handler as EventListener);
  //   };
  // }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <div className="relative bg-black pb-10">
        <Hero />
        <div
          className={`w-full bg-black  transition-all duration-500 ${
            resultado
              ? "relative translate-y-0 mt-8"
              : "absolute top-full -translate-y-1/3"
          }`}
        >
          <div className="relative w-full max-w-3xl mx-auto">
            {/* Faixa laranja */}
            <div className="absolute -top-2 left-0 w-full h-4 bg-orange rounded-t-xl z-0" />

            <div className="relative bg-white rounded-xl shadow-md p-6 md:p-8 text-center z-10">
              <h2 className="text-xl font-bold text-black mb-4">
                Rastreie sua Encomenda
              </h2>

              {/* Formulário */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-stretch gap-4 mb-6"
              >
                <div className="flex items-center flex-1 border border-gray-300 rounded-md px-4 py-2 bg-gray-50">
                  <FiSearch className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="codigo"
                    value={codigoDigitado}
                    onChange={(e) => setCodigoDigitado(e.target.value)}
                    placeholder="Digite o código de rastreamento"
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-orange text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 transition"
                  >
                    Rastrear
                  </button>
                  {resultado && (
                    <button
                      type="button"
                      onClick={limpar}
                      className="bg-orange/80 text-white font-semibold px-4 py-2 rounded-md hover:bg-orange transition"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </form>

              {/* Resultado */}
              {resultado && (
                <div ref={resultadoRef}  className="text-left space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-semibold">
                        Código de Rastreamento:
                      </span>{" "}
                      <span className="text-orange font-bold">BR123456789</span>
                      <br />
                      <span className="text-gray-600">
                        Previsão de entrega: 24/04/2025
                      </span>
                    </div>
                    <span className="text-blue-600 bg-blue-100 text-xs px-2 py-1 rounded-full">
                      Em trânsito
                    </span>
                  </div>

                  {/* Linha do tempo */}
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-14 text-xs text-right">
                          <p>22/04/2025</p>
                          <p>14:30</p>
                        </div>

                        <div className="flex flex-col items-center mt-1">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              i === 0 ? "bg-blue-600" : "bg-orange"
                            }`}
                          />
                          {i < 2 && <div className="w-[2px] h-6 bg-orange" />}
                        </div>

                        <div className="text-sm">
                          <p className="font-bold">
                            Em trânsito para o destino
                          </p>
                          <p className="text-gray-600">São Paulo, SP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section  className={`bg-black text-white py-20 text-center px-6  ${
            resultado
              ? "pt-12"
              : "pt-48"
          }`}
      
      
     >
        <h1 className="font-primary text-2xl font-bold text-center pb-8">
          Quem somos?
        </h1>
        <p className="font-secondary text-lg font-normal text-center max-w-2xl mx-auto">
          Somos uma empresa especializada em logística e transporte de
          pacotes, oferecendo soluções personalizadas para facilitar o envio e
          a gestão de encomendas para pessoas e empresas.
        </p>
      </section>

      <ServicesSection />
      <FrequentlyQuestion />
      <footer className="bg-black text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        {/* Logo e redes sociais */}
        <div>
          <div className="mb-4">
            <Link to="/" className="text-xl font-bold text-black ">
              <img src="image.png" alt="logo" className="w-[3rem] h-[2rem]" />
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
            <span className="border-b-2 border-orange pb-1">
              Rastreie sua encomenda
            </span>
          </h3>
          <p  className="space-y-2 text-sm font-normal font-secondary text-lightGrey">
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

      <hr className="my-8 border-white/10" />

      <p className="text-xs text-center text-white/70">
        © 2025 Sistema de envio de pacotes. Todos os direitos reservados.
      </p>
    </footer>
    </div>
  );
}

export default Home;
