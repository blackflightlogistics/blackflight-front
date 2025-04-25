import { FaTruck, FaPlane, FaShip } from "react-icons/fa";
import ServiceCard from "./ServiceCard";

const ServicesSection = () => {
  return (
    <section className=" py-4 px-6">
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
