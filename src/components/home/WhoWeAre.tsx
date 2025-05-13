import { useLanguage } from "../../context/useLanguage";

interface WhoWeAreProps {
  resultado: boolean;
}

const WhoWeAre = ({ resultado }: WhoWeAreProps) => {
  const { translations: t } = useLanguage();

  return (
    <section id="quem-somos"
      className={`bg-black text-white text-center px-6 ${
        resultado ? "pt-12" : "pt-48"
      } py-20`}
    >
      <h1 className="font-primary text-2xl font-bold text-center pb-8">
        {t.who_we_are_title}
      </h1>
      <p className="font-secondary text-lg font-normal text-center max-w-2xl mx-auto">
        {t.who_we_are_description}
      </p>
    </section>
  );
};

export default WhoWeAre;
