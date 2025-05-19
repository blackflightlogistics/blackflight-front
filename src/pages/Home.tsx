import { useState, useRef } from "react";
import Header from "../components/home/Header";
import Navbar from "../components/Navbar";
import Hero from "../components/home/Hero";
import TrackingField from "../components/home/TrackingField";
import WhoWeAre from "../components/home/WhoWeAre";
import ServicesSection from "../components/home/ServicesSection";
import FrequentlyQuestion from "../components/home/FrequentlyQuestion";
import HomeFooter from "../components/home/HomeFooter";
import { trackingService } from "../services/trackingService";

function Home() {
  const [codigoDigitado, setCodigoDigitado] = useState("");
  const [resultado, setResultado] = useState(false);
  const resultadoRef = useRef<HTMLDivElement>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [info, setInfo] = useState<any>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
// const [error, setError] = useState<string | null>(null);
// const loading = false;
// const error: string | null = null;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setResultado(false);

  try {
    const dados = await trackingService.buscarPorCodigo(codigoDigitado);
    setInfo(dados);
    setResultado(true);
    setTimeout(() => {
      resultadoRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    setError(err.message || "Erro ao buscar código.");
  } finally {
    setLoading(false);
  }
};

const limpar = () => {
  setResultado(false);
  setInfo(null);
  setCodigoDigitado("");
};

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <div className="relative bg-black pb-10">
        <Hero />
        <TrackingField
          codigoDigitado={codigoDigitado}
          setCodigoDigitado={setCodigoDigitado}
          handleSubmit={handleSubmit}
          resultado={resultado}
          limpar={limpar}
          resultadoRef={resultadoRef}
          loading={loading}
          error={error}
          info={info}
        />
      </div>

      <WhoWeAre resultado={resultado} />
      <ServicesSection />
      <FrequentlyQuestion />
      <HomeFooter
        codigoDigitado={codigoDigitado}
        setCodigoDigitado={setCodigoDigitado}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default Home;
