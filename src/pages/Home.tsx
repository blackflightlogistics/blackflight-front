import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { Encomenda } from "../services/encomendaService";
import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import TrackingField from "../components/home/TrackingField";
import ServicesSection from "../components/home/ServicesSection";
import WhoWeAre from "../components/home/WhoWeAre";
import FrequentlyQuestion from "../components/home/FrequentlyQuestion";
import HomeFooter from "../components/home/HomeFooter";

function Home() {
  const [codigo, setCodigo] = useState("");
  const [encomenda, setEncomenda] = useState<Encomenda | null>(null);
  const resultadoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: CustomEvent<string>) => {
      const codigoBuscado = e.detail;
      setCodigo(codigoBuscado);

      fetch("/mocks/encomendas.json")
        .then((res) => res.json())
        .then((data: Encomenda[]) => {
          const encontrada = data.find((e) => `E-${e.id}` === codigoBuscado);
          setEncomenda(encontrada || null);

          setTimeout(() => {
            resultadoRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        });
    };

    window.addEventListener("buscar-encomenda", handler as EventListener);

    return () => {
      window.removeEventListener("buscar-encomenda", handler as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <div className="relative">
        <Hero />
        <div className="absolute w-full top-full -translate-y-1/3">
          <TrackingField />
        </div>
      </div>

      <WhoWeAre />

      <ServicesSection />
      <FrequentlyQuestion />

      {/* <section
        ref={resultadoRef}
        id="rastreamento-resultado"
        className="py-16 px-6 max-w-3xl mx-auto"
      >
        {encomenda ? (
          <div className="bg-white shadow p-4 rounded border">
            <h3 className="text-lg font-bold mb-2">
              Resultado do Rastreamento
            </h3>
            <p>
              <strong>Status:</strong> {encomenda.status}
            </p>
            <p>
              <strong>Valor total:</strong> R${" "}
              {encomenda.valorTotal?.toFixed(2)}
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {encomenda.pacotes.map((p) => (
                <li key={p.id}>
                  📦 <strong>{p.descricao}</strong> - {p.peso}kg - {p.status}
                </li>
              ))}
            </ul>
          </div>
        ) : codigo ? (
          <p className="text-gray-500 text-center">
            Nenhuma encomenda encontrada para o código:{" "}
            <strong>{codigo}</strong>
          </p>
        ) : null}
      </section> */}

      {/* Chamada para ação */}
      {/* <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Fale com a gente agora mesmo!
        </h2>
        <p className="text-gray-700 mb-6">
          Tire dúvidas ou solicite um orçamento personalizado.
        </p>
        <a
          href="https://wa.me/SEUNUMEROAQUI"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-green-500 text-white font-bold rounded hover:bg-green-600"
        >
          💬 Falar no WhatsApp
        </a>
      </section> */}
      <HomeFooter />
      {/* Rodapé */}
      {/* <footer className="bg-gray-200 py-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Sistema de Envio de Pacotes. Todos os
        direitos reservados.
      </footer> */}
    </div>
  );
}

export default Home;
