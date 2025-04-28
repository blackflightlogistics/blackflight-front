import { useState, useRef } from "react";
import Header from "../components/home/Header";
import Navbar from "../components/Navbar";
import Hero from "../components/home/Hero";
import TrackingField from "../components/home/TrackingField";
import WhoWeAre from "../components/home/WhoWeAre";
import ServicesSection from "../components/home/ServicesSection";
import FrequentlyQuestion from "../components/home/FrequentlyQuestion";
import HomeFooter from "../components/home/HomeFooter";

function Home() {
  const [codigoDigitado, setCodigoDigitado] = useState("");
  const [resultado, setResultado] = useState(false);
  const resultadoRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigoDigitado.trim() !== "") {
      setResultado(true);
      setTimeout(() => {
        resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const limpar = () => {
    setCodigoDigitado("");
    setResultado(false);
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
