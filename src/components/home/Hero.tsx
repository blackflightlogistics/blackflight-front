import { useLanguage } from "../../context/useLanguage";

const Hero = () => {
  const { translations: t } = useLanguage();

    return (
      <section id="hero">
        <div
          className="relative bg-cover bg-center w-full aspect-[209/197] md:aspect-[509/210]"
          style={{
            backgroundImage: `url('home-bg.png')`,
          }}
        >
          {/* Overlay com gradiente escuro uniforme */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/50 z-0" />
  
          {/* Conteúdo acima do overlay */}
          <div className="absolute inset-14 flex items-end z-10">
            <div className="text-white  md:p-8 max-w-[35rem]">
              <p className="font-primary  text-xl sm:text-3xl md:text-4xl font-bold leading-none  ">
              {t.hero_titulo}
              </p>
              <p className="font-secondary text-sm sm:text-lg font-normal mb-1 sm:mb-4">
              {t.hero_subtitulo}
              </p>
              <button
                type="button"
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send/?phone=${encodeURIComponent(+237656649186)}`, "_blank");
                }}
                    
                    className="bg-orange font-secondary text-xs sm:text-sm text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 transition mb-10 sm:mb-0"
                  >
                    {t.hero_cta_whatsapp}
                  </button>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
export default Hero;
