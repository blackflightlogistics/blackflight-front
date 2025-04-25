import { FaTruck, FaPlane, FaShip } from "react-icons/fa";
import ServiceCard from "./ServiceCard";

const ServicesSection = () => {
  return (
    <section className=" py-16 px-6">
      <h2 className="font-primary text-2xl font-bold text-center pb-4">
        Nossos Serviços
      </h2>
      <p className="font-secondary text-sm font-normal text-center max-w-2xl mx-auto mb-8">
        Oferecemos soluções completas em logística para atender às necessidades
        específicas do seu negócio, com qualidade e eficiência.
      </p>
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
        <ServiceCard
          icon={<FaTruck />}
          title="Envio de Pacotes"
          description="Transporte de cargas fracionadas e completas para todo o território nacional, com monitoramento em tempo real."
        />
        <ServiceCard
          icon={<FaPlane />}
          title="Rastreamento Online"
          description="Soluções rápidas para entregas urgentes, com cobertura nacional e internacional para cargas de todos os tamanhos."
        />
        <ServiceCard
          icon={<FaShip />}
          title="Atendimento Personalizado"
          description="Importação e exportação de cargas em containers, com assessoria completa em comércio exterior."
        />
      </div>
    </section>
  );
};

export default ServicesSection;
