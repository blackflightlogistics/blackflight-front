import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      className={`pt-4  pb-4  left-0 w-full transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } bg-white border-b border-gray-200 z-50`}
    >
      <div className="flex  justify-between items-center max-w-7xl mx-auto px-4 md:px-8">
        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-black">
          <img src="image.png" alt="logo" className="w-[3rem] h-[2rem]" />
        </Link>

        {/* LINKS - DESKTOP */}
        <div className="hidden md:flex items-center gap-4">
          <p className="font-secondary text-sm font-medium text-orange">Início</p>
          <p className="font-secondary text-sm font-medium">Rastreio</p>
          <p className="font-secondary text-sm font-medium">Quem Somos</p>
          <p className="font-secondary text-sm font-medium">Nossos Serviços</p>
          {/* <form
            onSubmit={(e) => {
              e.preventDefault();
              const codigo = e.currentTarget.codigo.value;
              const destino = document.getElementById("rastreamento-resultado");
              if (codigo && destino) {
                window.scrollTo({
                  top: destino.offsetTop - 80,
                  behavior: "smooth",
                });
                window.dispatchEvent(
                  new CustomEvent("buscar-encomenda", { detail: codigo })
                );
              }
            }}
            className="flex items-center border border-gray-400 rounded"
          >
            <input
              name="codigo"
              placeholder="Código de rastreio"
              className="px-3 py-2 text-sm outline-none"
            />
            <button type="submit" className="px-3 py-2">
              🔍
            </button>
          </form> */}

          
        </div>
        <Link
            to="/admin/login"
            className="px-4 py-2 bg-black text-white text-sm font-normal font-secondary rounded-md hover:opacity-80 "
          >
            Área Administrativa
          </Link>
        {/* MENU MOBILE */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? (
            <FiX size={28} className="text-black" />
          ) : (
            <img src="hamburguer-black-button.svg"alt="Abrir menu" className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* MENU MOBILE */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-white border-t border-gray-200 p-4 space-y-4">
          <Link
            to="/rastreamento"
            onClick={() => setIsOpen(false)}
            className="text-sm text-black font-semibold"
          >
            Onde está meu pacote
          </Link>
          <Link
            to="/admin/login"
            onClick={() => setIsOpen(false)}
            className="text-sm text-black font-semibold"
          >
            Área Administrativa
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
