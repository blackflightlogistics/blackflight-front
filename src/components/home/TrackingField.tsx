import { FiSearch } from "react-icons/fi";

const TrackingField = () => {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Faixa laranja por trás */}
      <div className="absolute -top-2 left-0 w-full h-4 bg-orange rounded-t-xl z-0" />

      {/* Container branco sobre a faixa */}
      <div className="relative bg-white rounded-xl shadow-md p-6 md:p-8 text-center z-10">
        <h2 className="text-xl font-bold text-black mb-4">Rastreie sua Encomenda</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const codigo = e.currentTarget.codigo.value;
            if (codigo) {
              window.dispatchEvent(
                new CustomEvent("buscar-encomenda", { detail: codigo })
              );
            }
          }}
          className="flex flex-col sm:flex-row items-stretch gap-4"
        >
          <div className="flex items-center flex-1 border border-gray-300 rounded-md px-4 py-2 bg-gray-50">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              name="codigo"
              placeholder="Digite o código de rastreamento"
              className="flex-1 bg-transparent outline-none text-sm text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="bg-orange text-white font-semibold px-6 py-2 rounded-md hover:opacity-90 transition"
          >
            Rastrear
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrackingField;
