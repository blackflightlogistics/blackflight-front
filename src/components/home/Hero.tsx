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
              <p className="font-secondary text-lg font-normal mb-4">
                A forma mais simples, rápida e segura de enviar e rastrear
                encomendas.
              </p>
              <button
                type="button"
                onClick={() => {
                  window.open("https://wa.me/5511999999999", "_blank");
                }}
                    
                    className="bg-orange font-secondary text-sm text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 transition"
                  >
                    Contato via Whatsapp
                  </button>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
export default Hero;
