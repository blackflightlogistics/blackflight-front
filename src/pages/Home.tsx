import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { Encomenda } from "../services/encomendaService";
import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import TrackingField from "../components/home/TrackingField";
import ServicesSection from "../components/home/ServicesSection";

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

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-black text-white py-20 text-center px-6 pt-48">
          <h1 className="font-primary text-2xl font-bold text-center pb-8">
            Quem somos?
          </h1>
          <p className="font-secondary text-lg font-normal text-center max-w-2xl mx-auto">
            Somos uma empresa especializada em logística e transporte de
            pacotes, oferecendo soluções personalizadas para facilitar o envio e
            a gestão de encomendas para pessoas e empresas.
          </p>
        </section>

        {/* Sobre nós */}
        {/* <section className="py-16 px-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Quem Somos
          </h2>
          <p className="text-gray-700 text-center">
            Somos uma empresa especializada em logística e transporte de
            pacotes, oferecendo soluções personalizadas para facilitar o envio e
            a gestão de encomendas para pessoas e empresas.
          </p>
        </section> */}

        {/* Serviços */}
        <section className="bg-gray-100 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-primary text-2xl font-bold text-center pb-4">
              Nossos Serviços
            </h2>
            <p className="font-secondary text-sm font-normal text-center max-w-2xl mx-auto mb-8">
                  Oferecemos soluções completas em logística para atender às
                  necessidades específicas do seu negócio, com qualidade e
                  eficiência.
                </p>
                <ServicesSection />
            {/* <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded shadow text-center">
                <h3 className="text-lg font-bold mb-2">Envio de Pacotes</h3>
                <p className="font-secondary text-sm font-normal text-center">
                  Oferecemos soluções completas em logística para atender às
                  necessidades específicas do seu negócio, com qualidade e
                  eficiência.
                </p>
              </div>
              <div className="bg-white p-6 rounded shadow text-center">
                <h3 className="text-lg font-bold mb-2">Rastreamento Online</h3>
                <p className="text-gray-600">
                  Acompanhe o status de suas encomendas a qualquer momento, em
                  qualquer lugar.
                </p>
              </div>
              <div className="bg-white p-6 rounded shadow text-center">
                <h3 className="text-lg font-bold mb-2">
                  Atendimento Personalizado
                </h3>
                <p className="text-gray-600">
                  Suporte ágil e dedicado para você ou sua empresa.
                </p>
              </div>
            </div> */}
          </div>
        </section>

        {/* Resultado da busca */}
        <section
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
        </section>

        {/* Chamada para ação */}
        <section className="py-16 px-6 text-center">
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
        </section>
      </main>

      {/* Rodapé */}
      <footer className="bg-gray-200 py-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Sistema de Envio de Pacotes. Todos os
        direitos reservados.
      </footer>
    </div>
  );
}

export default Home;
