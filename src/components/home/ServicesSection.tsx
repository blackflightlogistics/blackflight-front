import { FaTruck, FaPlane, FaShip } from "react-icons/fa";
import ServiceCard from "./ServiceCard";
import { useLanguage } from "../../context/useLanguage";

const ServicesSection = () => {
  const { translations: t } = useLanguage();

  return (
    <section className="py-16 px-6">
      <h2 className="font-primary text-2xl font-bold text-center pb-4">
        {t.services_title}
      </h2>
      <p className="font-secondary text-sm font-normal text-center max-w-2xl mx-auto mb-8">
        {t.services_subtitle}
      </p>
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
        <ServiceCard
          icon={<FaTruck />}
          title={t.services_card_1_title}
          description={t.services_card_1_description}
        />
        <ServiceCard
          icon={<FaPlane />}
          title={t.services_card_2_title}
          description={t.services_card_2_description}
        />
        <ServiceCard
          icon={<FaShip />}
          title={t.services_card_3_title}
          description={t.services_card_3_description}
        />
      </div>
    </section>
  );
};

export default ServicesSection;
