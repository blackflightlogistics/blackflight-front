const Hero = () => {
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
          <div className="absolute inset-16 flex items-end z-10">
            <div className="text-white p-6 md:p-8 max-w-[35rem]">
              <p className="font-primary text-3xl font-bold">
                Soluções inteligentes para envio de pacotes
              </p>
              <p className="font-secondary text-lg font-normal">
                A forma mais simples, rápida e segura de enviar e rastrear
                encomendas.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
export default Hero;
